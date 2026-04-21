import csv
import json
from pathlib import Path


ROOT = Path("/Users/bytedance/Desktop/trae_roject/dahuang_test")
SOURCES = {
    "Gemini-3.1-Pro": ROOT / "translation_bad_cases_analysis_gemini3.1_pro.csv",
    "GPT-4.1-mini": ROOT / "translation_bad_cases_analysis_gpt4.1_mini.csv",
    "CLA": ROOT / "translation_bad_cases_analysis_cla.csv",
    "Gemini-3.1-Flash": ROOT / "translation_bad_cases_analysis_gemini3.1_flash.csv",
}
PER_MODEL_OUTPUTS = {
    "Gemini-3.1-Pro": ROOT / "data" / "translation_bad_cases_gemini31pro.json",
    "GPT-4.1-mini": ROOT / "data" / "translation_bad_cases_gpt41mini.json",
    "CLA": ROOT / "data" / "translation_bad_cases_cla.json",
    "Gemini-3.1-Flash": ROOT / "data" / "translation_bad_cases_gemini31flash.json",
}
COMBINED_OUTPUT_PATH = ROOT / "data" / "translation_bad_cases_all_models.json"

FAILED_MODEL_MAP = {
    "gpt5": "GPT-5",
    "gemini3.1-p": "Gemini 3.1-Pro",
}
ERROR_PATTERN_PRIORITY = [
    "漏翻",
    "幻觉新增",
    "语义弱化",
    "专有名词误译",
    "OCR 噪声放大",
    "上下文丢失",
    "错译",
    "未分类",
]


def normalize_failed_model(raw_value: str):
    tokens = [token.strip() for token in raw_value.split(",") if token.strip()]
    normalized = [FAILED_MODEL_MAP.get(token, token) for token in tokens]
    normalized = sorted(set(normalized), key=lambda item: ["GPT-5", "Gemini 3.1-Pro"].index(item) if item in ["GPT-5", "Gemini 3.1-Pro"] else 99)
    if not normalized:
        normalized = ["未知"]
    if len(normalized) == 2:
        failed_scope = "双裁判"
    elif normalized[0] == "GPT-5":
        failed_scope = "GPT-5"
    elif normalized[0] == "Gemini 3.1-Pro":
        failed_scope = "Gemini 3.1-Pro"
    else:
        failed_scope = "未知"
    return normalized, failed_scope


def short_text(text: str, limit: int = 140) -> str:
    text = " ".join((text or "").split())
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "..."


def parse_json_field(raw_value: str, default):
    if not raw_value:
        return default
    try:
        return json.loads(raw_value)
    except Exception:
        return default


ATTRIBUTION_MAP = {
    "omitted": "漏翻",
    "untranslated": "未翻译",
    "mistranslated": "错译",
    "sanitized": "和谐",
    "fabricated": "捏造",
}

def parse_attribution(raw_attr: str):
    if not raw_attr:
        return ["未分类"]
    tokens = [t.strip().lower() for t in raw_attr.split(",") if t.strip()]
    patterns = [ATTRIBUTION_MAP.get(token, token) for token in tokens]
    return sorted(set(patterns)) or ["未分类"]


def build_case(row: dict, translation_model: str):
    risk_list = parse_json_field(row.get("risk_list", ""), [])
    risk_agent_output = parse_json_field(row.get("risk_agent_output", ""), {})
    violations = risk_agent_output.get("violations", [])

    failed_judges, failed_scope = normalize_failed_model(row.get("failed_model", ""))
    risk_types = sorted({item.get("risk_type", "未知") for item in risk_list if item.get("risk_type")})
    source_fields = sorted({item.get("source_field", "未知") for item in risk_list if item.get("source_field")})
    languages = sorted({item.get("language", "未知") for item in violations if item.get("language")}) or ["未知"]
    trigger_texts = [item.get("source_expression", "") for item in risk_list if item.get("source_expression")]
    inaccurate_reason = row.get("inaccurate_reason", "")
    attribution_raw = row.get("attribution", "")
    error_patterns = parse_attribution(attribution_raw)

    return {
        "object_id": row.get("object_id", ""),
        "translation_model": translation_model,
        "failed_judges": failed_judges,
        "failed_scope": failed_scope,
        "fn_count_gemini": int(float(row.get("fn_count_gemini", 0) or 0)),
        "fp_count_gemini": int(float(row.get("fp_count_gemini", 0) or 0)),
        "fn_count_gpt5": int(float(row.get("fn_count_gpt5", 0) or 0)),
        "fp_count_gpt5": int(float(row.get("fp_count_gpt5", 0) or 0)),
        "risk_types": risk_types or ["未知"],
        "primary_risk_type": risk_types[0] if risk_types else "未知",
        "source_fields": source_fields or ["未知"],
        "primary_source_field": source_fields[0] if source_fields else "未知",
        "languages": languages,
        "primary_language": languages[0],
        "trigger_texts": trigger_texts,
        "signal_count": len(risk_list),
        "violation_count": int(risk_agent_output.get("total_violations_found", len(violations)) or 0),
        "source_preview": short_text(row.get("source_text", "")),
        "translation_preview": short_text(row.get("translation_text", "")),
        "source_text": row.get("source_text", ""),
        "translation_text": row.get("translation_text", ""),
        "overall_case_assessment": risk_agent_output.get("overall_case_assessment", ""),
        "inaccurate_reason": inaccurate_reason,
        "error_patterns": error_patterns,
        "primary_error_pattern": error_patterns[0],
        "risk_list": risk_list,
        "violations": violations,
    }


def build_payload(cases: list, translation_model: str):
    risk_types = sorted({risk for case in cases for risk in case["risk_types"]})
    source_fields = sorted({field for case in cases for field in case["source_fields"]})
    languages = sorted({lang for case in cases for lang in case["languages"]})
    error_patterns = sorted(
        {pattern for case in cases for pattern in case["error_patterns"]},
        key=lambda item: ERROR_PATTERN_PRIORITY.index(item) if item in ERROR_PATTERN_PRIORITY else 99,
    )
    failed_scopes = ["全部", "GPT-5", "Gemini 3.1-Pro", "双裁判"]

    return {
        "summary": {
            "translation_model": translation_model,
            "total_cases": len(cases),
            "available_filters": {
                "failed_scope": failed_scopes,
                "risk_types": risk_types,
                "source_fields": source_fields,
                "languages": languages,
                "error_patterns": error_patterns,
            },
        },
        "cases": cases,
    }


def load_cases(csv_path: Path, translation_model: str):
    with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    return [build_case(row, translation_model) for row in rows]


def main():
    all_cases = []
    model_summaries = []

    for model_name, csv_path in SOURCES.items():
        cases = load_cases(csv_path, model_name)
        payload = build_payload(cases, model_name)
        output_path = PER_MODEL_OUTPUTS[model_name]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with output_path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        all_cases.extend(cases)
        model_summaries.append(
            {
                "translation_model": model_name,
                "total_cases": len(cases),
            }
        )
        print(f"Parsed {len(cases)} bad cases to {output_path}")

    combined_payload = build_payload(all_cases, "全部")
    combined_payload["summary"]["translation_models"] = sorted(SOURCES.keys())
    combined_payload["summary"]["model_summaries"] = model_summaries

    COMBINED_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with COMBINED_OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(combined_payload, f, ensure_ascii=False, indent=2)
    print(f"Parsed {len(all_cases)} bad cases to {COMBINED_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
