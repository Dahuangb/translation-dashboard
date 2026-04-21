import html
import json
import os

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st


MODEL_ORDER = ["Gemini-3-Flash", "GPT-4.1-mini", "CLA", "Gemini-3.1-Pro"]
BRAND = "#2563EB"
WIN = "#10B981"
RISK = "#DC2626"
WARN = "#F97316"
GRAY_BG = "#F3F4F6"
GRAY_TEXT = "#475569"
GRAY_LIGHT = "#CBD5E1"
GRAY_MID = "#94A3B8"
GRAY_DARK = "#0F172A"
ERROR_COLORS = {
    "漏翻": "#B91C1C",
    "未翻译": "#F97316",
    "错译": "#64748B",
    "和谐": "#7C3AED",
    "捏造": "#334155",
}
DEFECT_COPY = {
    "Gemini-3-Flash": "错译为主，但整体错误量最低",
    "GPT-4.1-mini": "错译偏多，和谐类问题也偏高",
    "CLA": "未翻译问题明显",
    "Gemini-3.1-Pro": "漏翻失控",
}


st.set_page_config(
    page_title="翻译模型评估结论",
    page_icon="📌",
    layout="wide",
    initial_sidebar_state="collapsed",
)


@st.cache_data
def load_data(file_mtime: float = 0):
    file_path = os.path.join(os.path.dirname(__file__), "data", "translation_data.json")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


BAD_CASE_LIBRARY_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "translation_bad_cases_all_models.json",
)


@st.cache_data
def load_bad_case_library(file_mtime: float):
    file_path = BAD_CASE_LIBRARY_PATH
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def fmt_pct(value: float) -> str:
    return f"{value:.1f}%"


def fmt_num(value: float) -> str:
    return f"{value:.1f}"


def fmt_int(value: float) -> str:
    return f"{int(round(value)):,}"


def to_html_text(value: str) -> str:
    return html.escape(value or "").replace("\n", "<br>")





data_mtime = os.path.getmtime(os.path.join(os.path.dirname(__file__), "data", "translation_data.json"))
data = load_data(data_mtime)
bad_case_library = load_bad_case_library(os.path.getmtime(BAD_CASE_LIBRARY_PATH))

leaderboard_df = pd.DataFrame(data["leaderboard"]).set_index("model").reindex(MODEL_ORDER).reset_index()
overall_df = pd.DataFrame(data["overall_performance"]).rename(
    columns={"gpt5_recall": "GPT-5 口径", "gemini_recall": "Gemini 口径"}
)
overall_df["综合口径"] = overall_df[["GPT-5 口径", "Gemini 口径"]].mean(axis=1)
overall_df = overall_df.set_index("model").reindex(MODEL_ORDER).reset_index()

mqm_df = pd.DataFrame(data["mqm_breakdown"]).rename(
    columns={"tp": "TP", "fn": "FN", "fp": "FP", "avg": "平均 MQM"}
)
mqm_df = mqm_df.set_index("model").reindex(MODEL_ORDER).reset_index()

lang_df = pd.DataFrame(data["language_performance"])
lang_df["model"] = pd.Categorical(lang_df["model"], categories=MODEL_ORDER, ordered=True)
lang_df = lang_df.sort_values(["language", "model"])

error_df = pd.DataFrame(data["error_distribution"]).set_index("model").reindex(MODEL_ORDER).reset_index()
error_long_df = error_df.melt(id_vars="model", var_name="错误类型", value_name="数量")

winner = data["winner"]
winner_row = leaderboard_df[leaderboard_df["model"] == winner].iloc[0]
winner_overall = overall_df[overall_df["model"] == winner].iloc[0]

stability_df = (
    lang_df.groupby("model", as_index=False, observed=False)["recall"]
    .agg(max_recall="max", min_recall="min", mean_recall="mean")
)
stability_df["波动"] = stability_df["max_recall"] - stability_df["min_recall"]
stability_df["稳定性评分"] = 100 - stability_df["波动"]
stability_df = stability_df.set_index("model").reindex(MODEL_ORDER).reset_index()
winner_stability = stability_df[stability_df["model"] == winner].iloc[0]

language_summary = (
    lang_df.groupby("language", as_index=False, observed=False)["recall"]
    .agg(平均召回率="mean", 最高召回率="max", 最低召回率="min")
)
language_summary["差距"] = language_summary["最高召回率"] - language_summary["最低召回率"]
largest_gap_row = language_summary.sort_values("差距", ascending=False).iloc[0]
worst_language_row = language_summary.sort_values("平均召回率", ascending=True).iloc[0]

worst_error_row = (
    error_long_df.sort_values("数量", ascending=False)
    .iloc[0]
)

default_language = largest_gap_row["language"]
language_options = sorted(lang_df["language"].unique().tolist())
default_language_index = language_options.index(default_language) if default_language in language_options else 0

severe_priority = {"漏翻": 0, "未翻译": 1, "和谐": 2, "错译": 3, "捏造": 4}
bad_cases = sorted(data["bad_cases"], key=lambda item: severe_priority.get(item["type"], 99))
featured_case = bad_cases[0]
other_cases = bad_cases[1:]

bad_case_filters = bad_case_library["summary"]["available_filters"]
bad_case_models = bad_case_library["summary"].get("translation_models", [])
bad_case_model_summary = {
    item["translation_model"]: item["total_cases"]
    for item in bad_case_library["summary"].get("model_summaries", [])
}
bad_case_df = pd.DataFrame(bad_case_library["cases"])
bad_case_error_patterns = bad_case_filters.get("error_patterns", ["未分类"])
if "error_patterns" not in bad_case_df.columns:
    bad_case_df["error_patterns"] = bad_case_df.apply(lambda _: ["未分类"], axis=1)
else:
    bad_case_df["error_patterns"] = bad_case_df["error_patterns"].apply(
        lambda value: value if isinstance(value, list) and value else ["未分类"]
    )
if "primary_error_pattern" not in bad_case_df.columns:
    bad_case_df["primary_error_pattern"] = bad_case_df["error_patterns"].apply(lambda items: items[0])
else:
    bad_case_df["primary_error_pattern"] = bad_case_df.apply(
        lambda row: row["primary_error_pattern"] if isinstance(row["primary_error_pattern"], str) and row["primary_error_pattern"] else row["error_patterns"][0],
        axis=1,
    )
bad_case_df["total_failure_count"] = (
    bad_case_df["fn_count_gemini"]
    + bad_case_df["fp_count_gemini"]
    + bad_case_df["fn_count_gpt5"]
    + bad_case_df["fp_count_gpt5"]
)
bad_case_df["sort_weight"] = bad_case_df["failed_scope"].map(
    {"双裁判": 3, "GPT-5": 2, "Gemini 3.1-Pro": 2}
).fillna(1)
bad_case_df["search_blob"] = bad_case_df.apply(
    lambda row: " ".join(
        [
            str(row["object_id"]),
            row["source_text"],
            row["translation_text"],
            row["inaccurate_reason"],
            row["overall_case_assessment"],
            " ".join(row["trigger_texts"]),
        ]
    ).lower(),
    axis=1,
)


st.markdown(
    f"""
<style>
    .stApp {{
        background: {GRAY_BG};
        color: {GRAY_DARK};
    }}
    .block-container {{
        padding-top: 2rem;
        padding-bottom: 3rem;
        max-width: 1280px;
    }}
    .hero-card {{
        background: #ffffff;
        border-radius: 12px;
        padding: 24px 28px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        border-left: 6px solid {WIN};
        margin-bottom: 16px;
    }}
    .metric-card {{
        background: #ffffff;
        border-radius: 12px;
        padding: 18px 20px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        min-height: 110px;
    }}
    .section-header {{
        margin: 28px 0 12px 0;
    }}
    .risk-card {{
        background: #ffffff;
        border-radius: 12px;
        padding: 18px 20px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        border-top: 4px solid {WARN};
        min-height: 116px;
    }}
    .case-card {{
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        overflow: hidden;
        margin-bottom: 16px;
    }}
    .hero-title {{
        font-size: 32px;
        font-weight: 700;
        color: {GRAY_DARK};
        margin-bottom: 8px;
    }}
    .hero-subtitle {{
        font-size: 16px;
        color: {GRAY_TEXT};
        line-height: 1.6;
        max-width: 860px;
    }}
    .status-tag {{
        float: right;
        background: rgba(16, 185, 129, 0.12);
        color: #047857;
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
    }}
    .metric-label, .card-kicker {{
        font-size: 13px;
        color: {GRAY_MID};
        margin-bottom: 8px;
    }}
    .metric-value {{
        font-size: 28px;
        font-weight: 700;
        color: {GRAY_DARK};
        margin-bottom: 4px;
    }}
    .metric-note {{
        font-size: 13px;
        color: {GRAY_TEXT};
    }}
    .takeaway-chip {{
        display: inline-block;
        background: rgba(37, 99, 235, 0.08);
        color: {BRAND};
        border-radius: 999px;
        padding: 8px 12px;
        margin: 6px 10px 0 0;
        font-size: 13px;
        font-weight: 600;
    }}
    .section-title {{
        font-size: 24px;
        font-weight: 700;
        color: {GRAY_DARK};
        margin-bottom: 6px;
    }}
    .section-desc {{
        font-size: 14px;
        color: {GRAY_TEXT};
        line-height: 1.6;
    }}
    .risk-title {{
        font-size: 16px;
        font-weight: 700;
        color: {GRAY_DARK};
        margin-bottom: 8px;
    }}
    .risk-text {{
        font-size: 14px;
        color: {GRAY_TEXT};
        line-height: 1.6;
    }}
    .case-head {{
        background: rgba(220, 38, 38, 0.08);
        color: {RISK};
        padding: 14px 18px;
        font-size: 15px;
        font-weight: 700;
    }}
    .case-body {{
        padding: 18px;
    }}
    .case-grid {{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }}
    .case-label {{
        font-size: 13px;
        color: {GRAY_MID};
        margin-bottom: 8px;
    }}
    .case-text {{
        font-size: 14px;
        color: {GRAY_DARK};
        line-height: 1.7;
    }}
    .case-strip {{
        margin-top: 16px;
        padding: 12px 14px;
        border-radius: 10px;
        background: rgba(220, 38, 38, 0.08);
        color: {RISK};
        font-size: 14px;
        font-weight: 600;
    }}
    .small-note {{
        font-size: 13px;
        color: {GRAY_TEXT};
    }}
    .filter-card {{
        background: #ffffff;
        border-radius: 12px;
        padding: 16px 18px 8px 18px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        margin-bottom: 14px;
    }}
    .result-meta {{
        display: inline-block;
        margin-right: 8px;
        margin-top: 8px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.06);
        color: {GRAY_TEXT};
        font-size: 12px;
        font-weight: 600;
    }}
    .result-count {{
        font-size: 14px;
        color: {GRAY_TEXT};
        margin: 8px 0 14px 0;
    }}
    .list-card {{
        background: #ffffff;
        border-radius: 12px;
        padding: 14px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        height: 100%;
    }}
    .list-note {{
        font-size: 13px;
        color: {GRAY_TEXT};
        margin-bottom: 10px;
    }}
    .scope-tag {{
        display: inline-block;
        margin-bottom: 10px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.06);
        color: {GRAY_TEXT};
        font-size: 12px;
        font-weight: 700;
    }}
    .scope-tag-compare {{
        background: rgba(37, 99, 235, 0.08);
        color: {BRAND};
    }}
    .scope-tag-deepdive {{
        background: rgba(249, 115, 22, 0.10);
        color: {WARN};
    }}
    .pattern-tag {{
        display: inline-block;
        margin-right: 6px;
        margin-top: 8px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(249, 115, 22, 0.10);
        color: {WARN};
        font-size: 12px;
        font-weight: 700;
    }}
</style>
""",
    unsafe_allow_html=True,
)


metric_cols = st.columns(4)
hero_subtitle = (
    f"基于当前 5 个语言市场与本轮评测集，{winner} 在风险召回、翻译质量和语种稳定性上综合领先，当前更适合作为优先候选。"
)

st.markdown(
    f"""
<div class="hero-card">
    <div class="status-tag">当前建议：优先候选</div>
    <div class="hero-title">翻译模型评估结论</div>
    <div class="hero-subtitle">{hero_subtitle}</div>
</div>
""",
    unsafe_allow_html=True,
)

hero_metrics = [
    ("综合排名", "第 1 名", f"{winner} 当前综合领先"),
    ("风险召回率", fmt_pct(winner_row["recall"]), "跨模型综合表现最高"),
    ("平均 MQM", fmt_num(winner_row["mqm"]), "整体质量评分最高"),
    ("判定精度", fmt_pct(winner_row["precision"]), "高召回下仍保持高精度"),
]

for col, (label, value, note) in zip(metric_cols, hero_metrics):
    with col:
        st.markdown(
            f"""
<div class="metric-card">
    <div class="metric-label">{label}</div>
    <div class="metric-value">{value}</div>
    <div class="metric-note">{note}</div>
</div>
""",
            unsafe_allow_html=True,
        )

st.markdown(
    "".join(f'<span class="takeaway-chip">{item}</span>' for item in data["key_takeaway"]),
    unsafe_allow_html=True,
)
st.markdown(
    '<div class="small-note">适用边界：本页结论仅基于当前 5 个语言市场、当前评测集和本轮裁判口径，不代表所有语言与所有业务场景下的最终结论。</div>',
    unsafe_allow_html=True,
)

st.markdown(
    """
<div class="section-header">
    <div class="scope-tag scope-tag-compare">全局比较</div>
    <div class="section-title">总体表现对比</div>
    <div class="section-desc">左侧回答“谁最能抓风险”，右侧回答“谁翻得最稳”。当前推荐模型不仅召回率领先，在高质量命中样本上也保持最稳。</div>
</div>
""",
    unsafe_allow_html=True,
)

selected_judge = st.selectbox(
    "比较口径",
    ["综合口径", "GPT-5 口径", "Gemini 口径"],
    key="overview_judge",
    help="仅影响本模块的总体表现图。",
)

overview_cols = st.columns(2)

with overview_cols[0]:
    if selected_judge == "综合口径":
        fig_perf = go.Figure()
        fig_perf.add_trace(
            go.Bar(
                x=overall_df["model"],
                y=overall_df["GPT-5 口径"],
                name="GPT-5 口径",
                marker_color=BRAND,
                text=[fmt_pct(v) for v in overall_df["GPT-5 口径"]],
                textposition="outside",
                hovertemplate="%{x}<br>GPT-5 口径: %{y:.1f}%<extra></extra>",
            )
        )
        fig_perf.add_trace(
            go.Bar(
                x=overall_df["model"],
                y=overall_df["Gemini 口径"],
                name="Gemini 口径",
                marker_color=WIN,
                text=[fmt_pct(v) for v in overall_df["Gemini 口径"]],
                textposition="outside",
                hovertemplate="%{x}<br>Gemini 口径: %{y:.1f}%<extra></extra>",
            )
        )
        winner_y = max(winner_overall["GPT-5 口径"], winner_overall["Gemini 口径"])
    else:
        bar_colors = [WIN if model == winner else GRAY_LIGHT for model in overall_df["model"]]
        fig_perf = go.Figure(
            go.Bar(
                x=overall_df["model"],
                y=overall_df[selected_judge],
                marker_color=bar_colors,
                text=[fmt_pct(v) for v in overall_df[selected_judge]],
                textposition="outside",
                hovertemplate=f"%{{x}}<br>{selected_judge}: %{{y:.1f}}%<extra></extra>",
                showlegend=False,
            )
        )
        winner_y = winner_overall[selected_judge]

    fig_perf.add_annotation(
        x=winner,
        y=winner_y + 8,
        text="当前推荐",
        showarrow=False,
        font=dict(size=12, color=WIN),
        bgcolor="rgba(16,185,129,0.12)",
        bordercolor="rgba(16,185,129,0.2)",
        borderpad=4,
    )
    fig_perf.update_layout(
        title="风险召回率对比",
        height=430,
        margin=dict(l=0, r=0, t=52, b=0),
        paper_bgcolor="white",
        plot_bgcolor="white",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        yaxis=dict(range=[0, 115], gridcolor="#E5E7EB"),
        xaxis=dict(showgrid=False),
    )
    st.plotly_chart(fig_perf, use_container_width=True)

with overview_cols[1]:
    fig_mqm = go.Figure()
    
    # 绘制堆叠/分组柱状图展示样本分布
    fig_mqm.add_trace(
        go.Bar(
            x=mqm_df["model"],
            y=mqm_df["TP"],
            name="TP (正确)",
            marker_color="#10B981", # 绿色代表正确
            text=[fmt_num(v) for v in mqm_df["TP"]],
            textposition="auto",
        )
    )
    fig_mqm.add_trace(
        go.Bar(
            x=mqm_df["model"],
            y=mqm_df["FN"],
            name="FN (漏报)",
            marker_color="#F59E0B", # 橙色代表漏报
            text=[fmt_num(v) for v in mqm_df["FN"]],
            textposition="auto",
        )
    )
    fig_mqm.add_trace(
        go.Bar(
            x=mqm_df["model"],
            y=mqm_df["FP"],
            name="FP (误报)",
            marker_color="#EF4444", # 红色代表误报
            text=[fmt_num(v) for v in mqm_df["FP"]],
            textposition="auto",
        )
    )

    # 绘制平均 MQM 折线图 (使用副坐标轴)
    fig_mqm.add_trace(
        go.Scatter(
            x=mqm_df["model"],
            y=mqm_df["平均 MQM"],
            name="平均 MQM",
            mode="lines+markers+text",
            marker=dict(color=BRAND, size=10),
            line=dict(color=BRAND, width=3),
            text=[fmt_num(v) for v in mqm_df["平均 MQM"]],
            textposition="top center",
            textfont=dict(color=BRAND, size=13, weight="bold"),
            yaxis="y2"
        )
    )

    fig_mqm.update_layout(
        title="翻译质量综合分布 (MQM)",
        height=430,
        margin=dict(l=0, r=0, t=52, b=0),
        paper_bgcolor="white",
        plot_bgcolor="white",
        barmode="group",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        xaxis=dict(showgrid=False),
        yaxis=dict(title="样本数量", gridcolor="#E5E7EB"),
        yaxis2=dict(
            title=dict(text="平均 MQM 分数", font=dict(color=BRAND)),
            overlaying="y",
            side="right",
            range=[60, 105], # 将范围调整到合适区间，避免折线被压得太扁
            showgrid=False,
            tickfont=dict(color=BRAND)
        ),
    )
    st.plotly_chart(fig_mqm, use_container_width=True)

st.markdown(
    f"""
<div class="small-note">结论：{winner} 不只在召回率最高，在正确命中样本上的翻译质量也最稳。</div>
""",
    unsafe_allow_html=True,
)

st.markdown(
    """
<div class="section-header">
    <div class="scope-tag scope-tag-compare">全局比较</div>
    <div class="section-title">跨语种稳定性</div>
    <div class="section-desc">重点不是某一个语种偶然跑得高，而是不同语言市场里是否持续稳定、不掉链子。稳定性评分仅作为辅助观察指标，计算方式为 100 - 语种召回波动。</div>
</div>
""",
    unsafe_allow_html=True,
)

stability_cards = st.columns(3)
stability_copy = [
    (
        f"差距最大的语种：{largest_gap_row['language']}",
        f"第一名与最后一名相差 {fmt_num(largest_gap_row['差距'])} 个点",
    ),
    (
        f"整体最差语种：{worst_language_row['language']}",
        f"四个模型平均召回率仅 {fmt_pct(worst_language_row['平均召回率'])}",
    ),
    (
        f"{winner} 辅助观察指标：稳定性评分",
        f"{fmt_num(winner_stability['稳定性评分'])}，计算方式为 100 - 波动；当前跨语种波动 {fmt_num(winner_stability['波动'])}",
    ),
]
for col, (title, text) in zip(stability_cards, stability_copy):
    with col:
        st.markdown(
            f"""
<div class="risk-card">
    <div class="risk-title">{title}</div>
    <div class="risk-text">{text}</div>
</div>
""",
            unsafe_allow_html=True,
        )

stability_cols = st.columns([1.2, 1])

with stability_cols[0]:
    heatmap_df = lang_df.pivot(index="language", columns="model", values="recall").reindex(columns=MODEL_ORDER)
    fig_heat = px.imshow(
        heatmap_df,
        text_auto=".1f",
        aspect="auto",
        color_continuous_scale="RdYlGn",
        zmin=50,
        zmax=95,
        labels=dict(x="模型", y="语种", color="召回率"),
    )
    fig_heat.update_layout(
        title="各语种风险召回率",
        height=360,
        margin=dict(l=0, r=0, t=48, b=0),
        paper_bgcolor="white",
        plot_bgcolor="white",
        coloraxis_colorbar=dict(title="召回率"),
    )
    st.plotly_chart(fig_heat, use_container_width=True)

with stability_cols[1]:
    selected_language = st.selectbox(
        "观察语种",
        language_options,
        index=default_language_index,
        key="stability_language",
        help="仅影响本模块的语种下钻图。",
    )
    selected_lang_df = lang_df[lang_df["language"] == selected_language].copy()
    best_recall = selected_lang_df["recall"].max()
    selected_lang_df["与第一名差距"] = best_recall - selected_lang_df["recall"]
    selected_lang_df = selected_lang_df.sort_values(["与第一名差距", "recall"], ascending=[False, False])
    language_gap = language_summary[language_summary["language"] == selected_language].iloc[0]["差距"]
    st.markdown(
        f"""
<div class="risk-card" style="border-top-color:{RISK}; margin-bottom: 12px;">
    <div class="risk-title">{selected_language} 市场诊断</div>
    <div class="risk-text">{selected_language} 是当前对比中的重点观察语种，第一名与最后一名相差 {fmt_num(language_gap)} 个点。下面的条形图按“与第一名差距”排序，越靠上代表掉队越明显。</div>
</div>
""",
        unsafe_allow_html=True,
    )
    fig_lang = go.Figure()
    fig_lang.add_trace(
        go.Bar(
            x=selected_lang_df["recall"],
            y=selected_lang_df["model"],
            orientation="h",
            marker_color=[WIN if model == winner else GRAY_LIGHT for model in selected_lang_df["model"]],
            text=[f"{fmt_pct(r)}  |  差 {fmt_num(g)}" for r, g in zip(selected_lang_df["recall"], selected_lang_df["与第一名差距"])],
            textposition="outside",
            hovertemplate="%{y}<br>召回率: %{x:.1f}%<extra></extra>",
            showlegend=False,
        )
    )
    fig_lang.update_layout(
        title="单语种下钻",
        height=360,
        margin=dict(l=0, r=48, t=48, b=0),
        paper_bgcolor="white",
        plot_bgcolor="white",
        xaxis=dict(range=[0, 115], gridcolor="#E5E7EB", title="召回率"),
        yaxis=dict(showgrid=False, categoryorder="array", categoryarray=selected_lang_df["model"].tolist()),
    )
    st.plotly_chart(fig_lang, use_container_width=True)

st.markdown(
    """
<div class="section-header">
    <div class="scope-tag scope-tag-compare">全局比较</div>
    <div class="section-title">主要失误类型</div>
    <div class="section-desc">不同模型的失败方式并不相同。是否适合上线，取决于它最容易在哪一种错误上失控。</div>
</div>
""",
    unsafe_allow_html=True,
)

defect_cols = st.columns(4)
for col, model in zip(defect_cols, MODEL_ORDER):
    model_error = error_df[error_df["model"] == model].iloc[0]
    total_errors = int(model_error.drop(labels="model").sum())
    with col:
        st.markdown(
            f"""
<div class="risk-card">
    <div class="card-kicker">{model}</div>
    <div class="risk-title">{DEFECT_COPY[model]}</div>
    <div class="risk-text">总错误量 {fmt_int(total_errors)}，主问题为 {leaderboard_df[leaderboard_df['model'] == model].iloc[0]['main_error']}。</div>
</div>
""",
            unsafe_allow_html=True,
        )

selected_error = st.selectbox(
    "错误类型筛选",
    ["全部", "漏翻", "未翻译", "错译", "和谐", "捏造"],
    key="error_type_filter",
    help="仅影响本模块的错误分布图。",
)

if selected_error != "全部":
    chart_error_df = error_long_df[error_long_df["错误类型"] == selected_error].copy()
else:
    chart_error_df = error_long_df.copy()

fig_error = px.bar(
    chart_error_df,
    x="数量",
    y="model",
    color="错误类型",
    orientation="h",
    barmode="group",
    color_discrete_map=ERROR_COLORS,
    category_orders={"model": MODEL_ORDER},
)
fig_error.update_layout(
    height=420,
    margin=dict(l=0, r=0, t=12, b=0),
    paper_bgcolor="white",
    plot_bgcolor="white",
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    xaxis=dict(gridcolor="#E5E7EB", title="错误数量"),
    yaxis=dict(title=""),
)
st.plotly_chart(fig_error, use_container_width=True)

st.markdown(
    """
<div class="section-header">
    <div class="scope-tag scope-tag-compare">全局比较</div>
    <div class="section-title">高风险漏判案例</div>
    <div class="section-desc">先看一条代表性证据，再用筛选面板从 2,537 条 bad-case 里快速定位你想找的案例。</div>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown(
    f"""
<div class="case-card">
    <div class="case-head">本页最严重案例：{featured_case["model"]} / {featured_case["language"]} / {featured_case["type"]}</div>
    <div class="case-body">
        <div class="case-grid">
            <div>
                <div class="case-label">原文风险点</div>
                <div class="case-text">{to_html_text(featured_case["source"])}</div>
            </div>
            <div>
                <div class="case-label">错误译法</div>
                <div class="case-text">{to_html_text(featured_case["translation"])}</div>
            </div>
            <div>
                <div class="case-label">漏判原因</div>
                <div class="case-text">{to_html_text(featured_case["analysis"])}</div>
            </div>
        </div>
        <div class="case-strip">可能后果：{to_html_text(featured_case["impact"])}</div>
    </div>
</div>
""",
    unsafe_allow_html=True,
)

for case in other_cases:
    with st.expander(f"{case['model']} / {case['language']} / {case['type']}"):
        st.markdown(
            f"""
<div class="case-card">
    <div class="case-head">{case["model"]} / {case["language"]} / {case["type"]}</div>
    <div class="case-body">
        <div class="case-grid">
            <div>
                <div class="case-label">原文风险点</div>
                <div class="case-text">{to_html_text(case["source"])}</div>
            </div>
            <div>
                <div class="case-label">错误译法</div>
                <div class="case-text">{to_html_text(case["translation"])}</div>
            </div>
            <div>
                <div class="case-label">漏判原因</div>
                <div class="case-text">{to_html_text(case["analysis"])}</div>
            </div>
        </div>
        <div class="case-strip">可能后果：{to_html_text(case["impact"])}</div>
    </div>
</div>
""",
            unsafe_allow_html=True,
        )

st.markdown(
    """
<div class="section-header">
    <div class="scope-tag scope-tag-deepdive">多模型深挖</div>
    <div class="section-title">翻译模型案例检索台</div>
    <div class="section-desc">这里已接入多模型 bad-case 数据。先选择翻译模型，再在该模型案例子集里按失败裁判、风险类型、来源字段、市场和关键词筛选。</div>
</div>
""",
    unsafe_allow_html=True,
)

st.markdown('<div class="filter-card">', unsafe_allow_html=True)
case_model_options = bad_case_models or sorted(bad_case_df["translation_model"].unique().tolist())
default_case_model = "GPT-4.1-mini" if "GPT-4.1-mini" in case_model_options else case_model_options[0]
case_filter_cols = st.columns([1, 1, 1.1, 1.1, 1, 1, 1.2])
with case_filter_cols[0]:
    case_translation_model = st.selectbox(
        "翻译模型",
        case_model_options,
        index=case_model_options.index(default_case_model),
        key="case_translation_model",
    )
with case_filter_cols[1]:
    case_failed_scope = st.selectbox(
        "失败裁判",
        bad_case_filters["failed_scope"],
        key="case_failed_scope",
    )
with case_filter_cols[2]:
    case_risk_type = st.selectbox(
        "风险类型",
        ["全部"] + bad_case_filters["risk_types"],
        key="case_risk_type",
    )
with case_filter_cols[3]:
    case_error_pattern = st.selectbox(
        "误译模式",
        ["全部"] + bad_case_error_patterns,
        key="case_error_pattern",
    )
with case_filter_cols[4]:
    case_source_field = st.selectbox(
        "来源字段",
        ["全部"] + bad_case_filters["source_fields"],
        key="case_source_field",
    )
with case_filter_cols[5]:
    case_market = st.selectbox(
        "所属市场",
        ["全部"] + bad_case_filters.get("markets", ["未知"]),
        index=0,
        key="case_market",
    )
with case_filter_cols[6]:
    case_keyword = st.text_input(
        "关键词",
        placeholder="支持搜 object_id、风险词、误译原因",
        key="case_keyword",
    )

case_display_cols = st.columns([1, 1, 1.2])
with case_display_cols[0]:
    case_only_dual = st.checkbox("只看双裁判失败", value=False, key="case_only_dual")
with case_display_cols[1]:
    case_has_fn = st.checkbox("只看含 FN 的案例", value=False, key="case_has_fn")
with case_display_cols[2]:
    display_limit = st.slider("展示数量", min_value=5, max_value=30, value=10, step=5, key="case_display_limit")
st.markdown("</div>", unsafe_allow_html=True)

filtered_bad_case_df = bad_case_df[bad_case_df["translation_model"] == case_translation_model].copy()
if case_failed_scope != "全部":
    filtered_bad_case_df = filtered_bad_case_df[filtered_bad_case_df["failed_scope"] == case_failed_scope]
if case_only_dual:
    filtered_bad_case_df = filtered_bad_case_df[filtered_bad_case_df["failed_scope"] == "双裁判"]
if case_risk_type != "全部":
    filtered_bad_case_df = filtered_bad_case_df[
        filtered_bad_case_df["risk_types"].apply(lambda items: case_risk_type in items)
    ]
if case_error_pattern != "全部":
    filtered_bad_case_df = filtered_bad_case_df[
        filtered_bad_case_df["error_patterns"].apply(lambda items: case_error_pattern in items)
    ]
if case_source_field != "全部":
    filtered_bad_case_df = filtered_bad_case_df[
        filtered_bad_case_df["source_fields"].apply(lambda items: case_source_field in items)
    ]
if case_market != "全部":
    filtered_bad_case_df = filtered_bad_case_df[
        filtered_bad_case_df["market"] == case_market
    ]
if case_has_fn:
    filtered_bad_case_df = filtered_bad_case_df[
        (filtered_bad_case_df["fn_count_gemini"] > 0) | (filtered_bad_case_df["fn_count_gpt5"] > 0)
    ]
if case_keyword.strip():
    keyword = case_keyword.strip().lower()
    filtered_bad_case_df = filtered_bad_case_df[
        filtered_bad_case_df["search_blob"].str.contains(keyword, na=False)
    ]

filtered_bad_case_df = filtered_bad_case_df.sort_values(
    ["sort_weight", "total_failure_count", "violation_count", "signal_count"],
    ascending=[False, False, False, False],
)

filtered_count = len(filtered_bad_case_df)
dual_fail_count = int((filtered_bad_case_df["failed_scope"] == "双裁判").sum()) if filtered_count else 0
if filtered_count:
    top_risk_type = (
        filtered_bad_case_df["risk_types"].explode().value_counts().index[0]
    )
    top_source_field = (
        filtered_bad_case_df["source_fields"].explode().value_counts().index[0]
    )
else:
    top_risk_type = "-"
    top_source_field = "-"

summary_cols = st.columns(4)
summary_items = [
    (
        "当前模型案例量",
        f"{bad_case_model_summary.get(case_translation_model, len(bad_case_df[bad_case_df['translation_model'] == case_translation_model])):,} 条",
        f"当前查看模型：{case_translation_model}",
    ),
    ("筛选结果", f"{filtered_count:,} 条", f"占当前模型案例的 {filtered_count / max(bad_case_model_summary.get(case_translation_model, 1), 1) * 100:.1f}%"),
    ("双裁判失败", f"{dual_fail_count:,} 条", "说明两套口径同时漏掉的重案例数量"),
    ("当前主风险", top_risk_type, f"最常见来源字段：{top_source_field}"),
]
for col, (label, value, note) in zip(summary_cols, summary_items):
    with col:
        st.markdown(
            f"""
<div class="metric-card">
    <div class="metric-label">{label}</div>
    <div class="metric-value" style="font-size:24px;">{value}</div>
    <div class="metric-note">{note}</div>
</div>
""",
            unsafe_allow_html=True,
        )

st.markdown(
    f'<div class="result-count">当前模型：{case_translation_model}。当前展示前 {min(display_limit, filtered_count)} 条结果，共命中 {filtered_count:,} 条。排序规则为：双裁判失败优先，其次按总失败数、违规数、信号数降序排列。这是显式排序，不代表智能推荐。</div>',
    unsafe_allow_html=True,
)

if filtered_count == 0:
    st.info("当前筛选条件下没有命中案例，建议放宽关键词或取消部分筛选。")
else:
    display_records = filtered_bad_case_df.head(display_limit).to_dict("records")
    case_options = []
    case_lookup = {}
    for idx, record in enumerate(display_records):
        label = (
            f"{idx + 1:02d}. {record.get('primary_error_pattern', '未分类')} | {record.get('primary_risk_type', '未知')} | "
            f"{record.get('primary_source_field', '未知')} | {record.get('market', '未知')} | "
            f"{str(record['object_id'])[-6:]}"
        )
        case_options.append(label)
        case_lookup[label] = record

    browser_cols = st.columns([0.9, 1.6])
    with browser_cols[0]:
        st.markdown(
            """
<div class="list-card">
    <div class="risk-title">结果列表</div>
    <div class="list-note">左侧展示当前筛选结果中排序靠前的案例。点击一条后，右侧会切换到该案例的完整详情。</div>
</div>
""",
            unsafe_allow_html=True,
        )
        selected_case_label = st.radio(
            "案例列表",
            case_options,
            label_visibility="collapsed",
            key="bad_case_selected_label",
        )

    selected_record = case_lookup[selected_case_label]
    selected_meta = [
        selected_record["failed_scope"],
        selected_record.get("primary_risk_type", "未知"),
        selected_record.get("primary_source_field", "未知"),
        selected_record.get("market", "未知"),
        f"ID {selected_record['object_id']}",
    ]
    selected_patterns = "".join(
        f'<span class="pattern-tag">{pattern}</span>' for pattern in selected_record["error_patterns"]
    )

    with browser_cols[1]:
        st.markdown(
            f"""
<div class="case-card">
    <div class="case-head">当前查看案例：{selected_record["translation_model"]} / {selected_record["failed_scope"]}</div>
    <div class="case-body">
        {''.join(f'<span class="result-meta">{item}</span>' for item in selected_meta)}
        <div>{selected_patterns}</div>
        <div class="case-grid" style="margin-top: 14px;">
            <div>
                <div class="case-label">原文风险点</div>
                <div class="case-text">{to_html_text(selected_record["source_text"])}</div>
            </div>
            <div>
                <div class="case-label">错误译法</div>
                <div class="case-text">{to_html_text(selected_record["translation_text"])}</div>
            </div>
            <div>
                <div class="case-label">误译原因</div>
                <div class="case-text">{to_html_text(selected_record["inaccurate_reason"])}</div>
            </div>
        </div>
        <div class="case-strip">案例判断：{to_html_text(selected_record["overall_case_assessment"] or "该案例未提供额外总体判断。")}</div>
    </div>
</div>
""",
            unsafe_allow_html=True,
        )

with st.expander("方法说明"):
    st.markdown(
        f"""
- 样本规模：{data["methodology"]["sample_size"]}
- 评估方式：{data["methodology"]["description"]}
- 交互说明：顶部筛选会联动总体口径、语言下钻和错误类型图表。
- bad-case 解析：当前已接入 `translation_bad_cases_analysis_gemini3.1_pro.csv` 与 `translation_bad_cases_analysis_gpt4.1_mini.csv`，并合并为多模型案例库供前端检索。
"""
    )
