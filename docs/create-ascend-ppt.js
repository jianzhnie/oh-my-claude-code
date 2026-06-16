const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude Code";
pres.title = "GPU 与昇腾大模型生态调研与实践";
pres.subject = "昇腾大模型训练推理生态调研 + 鹏城实验室昇腾训练实践";

// Dark tech palette
const C = {
  bg: "0F172A",
  card: "1E293B",
  cardLight: "334155",
  text: "F8FAFC",
  muted: "94A3B8",
  accent: "06B6D4",
  accent2: "F59E0B",
  success: "10B981"
};

function txt(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontSize: 14,
    color: C.text,
    fontFace: "Microsoft YaHei",
    margin: 0,
    ...opts
  });
}

function card(slide, x, y, w, h, fill = C.card) {
  return slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fill },
    line: { color: C.cardLight, width: 1 },
    shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 8, offset: 3, angle: 135 }
  });
}

function bullets(slide, x, y, w, h, items, opts = {}) {
  const runs = items.map((it, i) => ({
    text: it,
    options: {
      bullet: true,
      breakLine: i < items.length - 1,
      fontSize: opts.fontSize || 13,
      color: opts.color || C.text,
      fontFace: "Microsoft YaHei"
    }
  }));
  slide.addText(runs, { x, y, w, h, margin: 0, lineSpacing: 22, ...opts });
}

function stat(slide, x, y, w, h, number, label, color = C.accent) {
  card(slide, x, y, w, h);
  txt(slide, number, x + 0.08, y + 0.10, w - 0.16, h * 0.50, {
    fontSize: 22, bold: true, color, align: "center", valign: "middle"
  });
  txt(slide, label, x + 0.08, y + h * 0.58, w - 0.16, h * 0.35, {
    fontSize: 9.5, color: C.muted, align: "center", valign: "top"
  });
}

function sectionTitle(slide, title, subtitle) {
  txt(slide, title, 0.5, 0.35, 9, 0.65, { fontSize: 34, bold: true });
  if (subtitle) txt(slide, subtitle, 0.5, 0.95, 9, 0.35, { fontSize: 14, color: C.muted });
}

function footer(slide, text) {
  txt(slide, text, 0.5, 5.38, 9, 0.2, { fontSize: 9, color: C.muted });
}

// ---------- Slide 1: Title ----------
let s = pres.addSlide();
s.background = { color: C.bg };
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
s.addShape(pres.shapes.RECTANGLE, { x: 0.55, y: 1.75, w: 0.12, h: 2.35, fill: { color: C.accent } });
txt(s, "GPU 与昇腾大模型生态", 0.85, 1.65, 8.6, 0.95, { fontSize: 46, bold: true });
txt(s, "调研与实践", 0.85, 2.5, 8.6, 0.95, { fontSize: 46, bold: true, color: C.accent });
txt(s, "训练推理生态分层对比 · 社区框架与算子支持 · 鹏城实验室昇腾千卡/万卡训练实践", 0.85, 3.55, 8, 0.5, { fontSize: 14, color: C.muted });
txt(s, "2026/06/15", 0.85, 4.35, 3, 0.3, { fontSize: 12, color: C.muted });

// ---------- Slide 2: TOC ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "目录", "调研篇 8–10 页 · 实战篇 4 页");
card(s, 0.5, 1.4, 4.4, 3.9);
txt(s, "调研篇", 0.7, 1.6, 4, 0.45, { fontSize: 20, bold: true, color: C.accent });
bullets(s, 0.7, 2.05, 4, 3.1, [
  "生态全景与训练硬件对比",
  "训练软件栈与并行策略",
  "超大规模模型昇腾训练实践",
  "推理生态与社区框架支持",
  "关键融合算子与加速库",
  "TCO、迁移与性能基准",
  "趋势判断与选型结论"
], { fontSize: 13 });

card(s, 5.1, 1.4, 4.4, 3.9);
txt(s, "实战篇", 5.3, 1.6, 4, 0.45, { fontSize: 20, bold: true, color: C.accent2 });
bullets(s, 5.3, 2.05, 4, 2.4, [
  "昇腾大模型训练技术栈",
  "7B GRPO 验证与 32B SFT/Offline RL",
  "千卡万卡大规模预训练",
  "LLMEval 评估框架与开源贡献"
], { fontSize: 13 });

// ---------- Slide 3: Ecosystem Panorama ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "生态全景图：GPU vs 昇腾", "从应用到硬件的分层对比");
const eco = [
  ["层级", "GPU 生态（NVIDIA）", "Ascend 生态（华为）"],
  ["应用层", "GPT、Claude、Llama、Grok", "盘古、DeepSeek-V4、GLM、LongCat"],
  ["训练框架", "PyTorch / JAX / TensorFlow", "MindSpore + PyTorch（torch_npu）"],
  ["分布式训练", "Megatron-LM、DeepSpeed、FSDP", "MindSpeed-LLM / MM / RL"],
  ["推理引擎", "vLLM、TensorRT-LLM、SGLang", "vLLM-Ascend、SGLang、MindIE"],
  ["算子/通信", "CUDA / Triton / NCCL", "Ascend C / TBE / HCCL"],
  ["编译/运行时", "CUDA Runtime / CUDA Graph", "CANN（GE + MindIR + AOE）"],
  ["硬件平台", "H100 / H200 / B200 / GB200", "910B / 910C / 950PR / 950DT"]
];
s.addTable(eco, {
  x: 0.5, y: 1.45, w: 9, h: 3.7,
  fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.4, 3.8, 3.8],
  autoPage: false
});
footer(s, "数据来源：gpu-ascend-llm-ecosystem-research.md");

// ---------- Slide 4: Training Hardware ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "训练硬件对比", "NVIDIA 单卡领先，昇腾以超节点 + 国产化弥补差距");
const hw = [
  ["维度", "NVIDIA GPU", "Ascend NPU"],
  ["主力芯片", "H100 / H200 / B200", "910B / 910C / 950DT"],
  ["BF16 峰值", "H100 989 TFLOPS / B200 ~4,500", "910B ~376 / 910C ~780 / 950DT ~1,000"],
  ["显存", "80GB → 141GB → 192GB", "64GB → 128GB → 144GB"],
  ["显存带宽", "3.35 TB/s → 8.0 TB/s", "1.6 TB/s → 3.2 TB/s → 4 TB/s"],
  ["互联", "NVLink 4/5: 900 GB/s–1.8 TB/s", "HCCS ~392 GB/s; 超节点互联"],
  ["集群", "DGX/HGX + IB/RoCE", "Atlas 800 + CloudMatrix"],
  ["功耗", "B200 1000W", "910B 310–400W"]
];
s.addTable(hw, {
  x: 0.5, y: 1.45, w: 9, h: 3.4,
  fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.4, 3.8, 3.8],
  autoPage: false
});
s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 5.0, w: 9, h: 0.35, fill: { color: C.accent } });
txt(s, "关键差异：NVIDIA 单卡算力/互联领先；Ascend 通过超节点 + 国产化供应在政企市场快速渗透。", 0.6, 5.02, 8.8, 0.31, { fontSize: 11, color: C.bg, bold: true, valign: "middle" });
footer(s, "注：950 系列规格基于公开路线图，实际以官方发布为准。");

// ---------- Slide 5: Training Software Stack ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "训练软件栈对比", "PyTorch + torch_npu 让 95%+ CUDA 代码可平滑迁移");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "GPU 生态", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.1, 4, 2.8, [
  "框架：PyTorch / JAX / TensorFlow",
  "分布式：Megatron-LM / DeepSpeed / FSDP",
  "通信：NCCL",
  "算子：cuBLAS / cuDNN / CUTLASS",
  "Kernel：CUDA / Triton",
  "编译器：CUDA Runtime / CUDA Graph"
], { fontSize: 12 });

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "昇腾生态", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 2.1, 4, 2.8, [
  "框架：MindSpore + PyTorch（torch_npu）",
  "分布式：MindSpeed-LLM / MM / RL",
  "通信：HCCL",
  "算子：AscendCL / ATB / 算子库",
  "Kernel：Ascend C / TBE / Ascend-Triton",
  "编译器：CANN（GE + MindIR + AOE）"
], { fontSize: 12 });
footer(s, "性能敏感部分（custom kernel、MoE All-to-All、FA 变体）通常需针对 Ascend 重写。");

// ---------- Slide 6: Parallelism ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "分布式并行策略", "数据/张量/流水线/序列/专家/上下文并行全覆盖");
const para = [
  ["并行策略", "GPU 生态", "Ascend 生态"],
  ["数据并行 DP", "PyTorch DDP / FSDP / DeepSpeed ZeRO", "MindSpeed DP + HCCL All-Reduce"],
  ["张量并行 TP", "Megatron-LM TP", "MindSpeed intra-node TP"],
  ["流水线并行 PP", "Megatron / DeepSpeed Pipeline", "MindSpeed PP"],
  ["序列并行 SP", "Megatron SP / DeepSpeed Ulysses", "MindSpeed SP / LongSeq"],
  ["专家并行 EP", "Megatron MoE EP", "MindSpeed EP + EPLB"],
  ["上下文并行 CP", "Ring Attention / Striped", "MindSpeed CP"]
];
s.addTable(para, {
  x: 0.5, y: 1.45, w: 9, h: 3.2,
  fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.5, 3.75, 3.75],
  autoPage: false
});
stat(s, 0.5, 4.85, 1.6, 0.75, "6 种", "并行策略", C.accent);
stat(s, 2.25, 4.85, 2.6, 0.75, "MindSpeed-LLM", "昇腾训练核心框架", C.accent2);
stat(s, 5.05, 4.85, 2.1, 0.75, "Megatron / DeepSpeed", "GPU 适配也可跑", C.success);
stat(s, 7.3, 4.85, 2.2, 0.75, "2026 支持 FSDP2", "QLoRA NF4 / GRPO", C.accent);
footer(s, "通用训练已可平滑迁移；MoE/长上下文/FP8 极致优化仍在持续追赶。");

// ---------- Slide 7: Large-scale Training Practice (Models) ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "超大规模模型昇腾训练实践", "从百亿到准万亿，国产算力已支撑 frontier 级模型");
const train = [
  ["模型", "规模/集群", "关键指标"],
  ["华为盘古 Ultra", "135B / 8192 NPU", "MFU 52%；13.2T tokens"],
  ["盘古 Ultra MoE", "718B(39B) / 万卡", "万卡 MFU 41%；256 专家"],
  ["DeepSeek-V4", "1.6T(49B) / 910B", "首个公开昇腾全栈适配万亿 frontier 模型"],
  ["美团 LongCat-2.0", "1T+ / 5–6 万国产卡", "支持 1M 上下文"],
  ["讯飞星火 X2-Flash", "30B MoE / 910B", "同规模 A800 效率 20%→90%"],
  ["CloudMatrix 384", "384×910C", "300 PFLOPS；48 TB HBM"]
];
s.addTable(train, {
  x: 0.5, y: 1.45, w: 9, h: 3.1,
  fontSize: 10.5, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [2.0, 2.8, 4.2],
  autoPage: false
});
stat(s, 0.50, 4.75, 2.03, 0.80, "52%", "盘古 Ultra MFU", C.success);
stat(s, 2.83, 4.75, 2.03, 0.80, "41%", "盘古 Ultra MoE 万卡", C.success);
stat(s, 5.16, 4.75, 2.03, 0.80, "1T+", "LongCat-2.0 参数", C.accent2);
stat(s, 7.49, 4.75, 2.03, 0.80, "300 PFLOPS", "CloudMatrix 384", C.accent);
footer(s, "数据来源：华为、DeepSeek、美团、讯飞等公开技术报告与媒体报道。");

// ---------- Slide 8: Inference Ecosystem ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "推理生态对比", "昇腾与 NVIDIA 差距最小；vLLM-Ascend 成为昇腾推理主入口");
card(s, 0.5, 1.45, 4.4, 3.5);
txt(s, "推理硬件与部署", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.1, 4, 2.7, [
  "芯片：H100/H200/B200/L40S vs 910B/C/950PR/310P",
  "量化：GPU FP4/FP8/INT8 成熟；昇腾 INT8 成熟、950 原生 FP8/FP4",
  "部署：单机/多机/K8s/边缘/Serverless",
  "关键差异：显存容量、量化、连续批处理、KV Cache 效率"
], { fontSize: 12 });

card(s, 5.1, 1.45, 4.4, 3.5);
txt(s, "vLLM-Ascend 现状", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 2.1, 4, 2.7, [
  "昇腾推理事实标准入口，接口与 vLLM 一致",
  "支持 DeepSeek-V3/R1、Qwen3/3.5、GLM5、Kimi-K2",
  "MindIE Turbo 已合并入 vLLM-Ascend",
  "ACLGraph、PD 分离、EPLB、投机解码、C8 INT8 KV Cache"
], { fontSize: 12 });
footer(s, "选型：高吞吐在线服务选 H200/B200；国产化在线服务选 910C/950PR + vLLM-Ascend。");

// ---------- Slide 9: Community Frameworks ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "社区框架与工具支持", "训练/微调、RL、推理、Hugging Face 生态快速补齐");
const fw = [
  ["类型", "代表框架", "状态", "关键特性"],
  ["训练/微调", "LLaMA-Factory", "官方支持", "100+ LLM/VLM；FSDP/DeepSpeed"],
  ["训练/微调", "ms-swift", "完整支持", "CPT/SFT/DPO/GRPO；自动 NPU patch"],
  ["RL/后训练", "verl", "一等公民", "MindSpeed/Megatron 后端"],
  ["RL/后训练", "MindSpeed RL", "华为官方", "吞吐提升 1.42×~3.97×"],
  ["RL/后训练", "slime-ascend", "智谱适配", "Megatron + SGLang"],
  ["推理引擎", "vLLM-Ascend", "事实标准", "模型覆盖最广"],
  ["推理引擎", "SGLang", "官方支持", "PD 分离、投机解码"],
  ["推理引擎", "MindIE", "华为自研", "政企高合规"],
  ["HF 生态", "transformers 等", "torch_npu 适配", "零迁移成本"]
];
s.addTable(fw, {
  x: 0.5, y: 1.45, w: 9, h: 3.7,
  fontSize: 9.5, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.3, 2.0, 1.5, 4.2],
  autoPage: false
});
footer(s, "选型速查：微调选 LLaMA-Factory/ms-swift；RL 选 MindSpeed RL/verl；推理选 vLLM-Ascend。");

// ---------- Slide 10: Key Operators ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "关键融合算子与加速库", "Ascend 在 FlashAttention、MoE、MLA 上从可用走向好用");
card(s, 0.5, 1.45, 4.4, 3.5);
txt(s, "Attention / MoE", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.1, 4, 2.7, [
  "FlashAttention：Ascend FlashAttention / AMLA 利用率 86.8%",
  "MLA：华为 AMLA / CloudMatrix-Infer MLAProlog",
  "MoE EP：DeepEP-Ascend / ascend_fuseep / MC2",
  "稠密融合：Fused RMSNorm / RoPE / SwiGLU / MoE"
], { fontSize: 12 });

card(s, 5.1, 1.45, 4.4, 3.5);
txt(s, "算子开发工具", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 2.1, 4, 2.7, [
  "底层语言：CUDA C++ vs Ascend C",
  "DSL：Triton/CUTLASS vs TBE / Ascend-Triton",
  "新兴 DSL：TileLang-Ascend（2026 FA / DeepSeek-V4）",
  "自动调优：nvFuser vs AOE；Profiler：Nsight vs MindStudio"
], { fontSize: 12 });
footer(s, "结论：关键算子差距快速缩小，但第三方社区算子丰富度仍有不足。");

// ---------- Slide 11: TCO & Performance ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "TCO 与性能基准", "国产化合规 vs 极致成本 vs 极致性能");
stat(s, 0.50, 1.45, 2.03, 0.80, "¥5–12万", "910B 单卡价", C.success);
stat(s, 2.83, 1.45, 2.03, 0.80, "¥11–20万", "910C 单卡价", C.success);
stat(s, 5.16, 1.45, 2.03, 0.80, "2–4 个月", "custom kernel 迁移", C.accent2);
stat(s, 7.49, 1.45, 2.03, 0.80, "35%–70%", "集群效率 vs H100", C.accent);

card(s, 0.5, 2.4, 4.4, 2.8);
txt(s, "性能参考", 0.7, 2.6, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 3.05, 4, 2.0, [
  "Llama3-70B：H100 MFU 45–55%；910B 30–40%；910C 40–50%",
  "盘古 Ultra 135B：MFU 52%；Ultra MoE：MFU 41%",
  "DeepSeek-R1 671B：910B decode 1,920 tokens/s/卡"
], { fontSize: 11.5 });

card(s, 5.1, 2.4, 4.4, 2.8);
txt(s, "迁移路径", 5.3, 2.6, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 3.05, 4, 2.0, [
  "简单 PyTorch 模型：1–2 周完成迁移",
  "自动迁移：transfer_to_npu 一行注入",
  "脚本转换：pytorch_gpu2npu.sh 批量替换",
  "手动迁移：torch.cuda→torch.npu、nccl→hccl、重写 kernel"
], { fontSize: 11.5 });
footer(s, "TCO 结论：国产化合规选昇腾；极致成本敏感可中断训练选 H100 spot。");

// ---------- Slide 12: Trends & Conclusions ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "趋势判断与选型结论", "");
card(s, 0.5, 1.4, 4.4, 3.75);
txt(s, "八大趋势", 0.7, 1.6, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.05, 4, 2.85, [
  "训练：NVIDIA 主流，昇腾在 closed market 渗透",
  "推理：昇腾与 NVIDIA 差距最小",
  "社区框架密集适配：LLaMA-Factory、verl、SGLang",
  "关键算子追赶：DeepEP-Ascend、AMLA、TileLang",
  "软件栈收敛：torch_npu + vLLM-Ascend + MindSpeed",
  "量化/压缩：FP4/FP8/INT8/MoE 稀疏成重点",
  "集群架构：从单卡竞赛转向超节点级设计",
  "开源：CANN 开源试图复制 CUDA 路径"
], { fontSize: 11 });

card(s, 5.1, 1.4, 4.4, 3.75);
txt(s, "选型结论", 5.3, 1.6, 4, 0.4, { fontSize: 17, bold: true, color: C.accent2 });
bullets(s, 5.3, 2.05, 4, 2.75, [
  "极致性能、最新算法、全球化部署 → NVIDIA",
  "国产化、合规、供应链安全、成本可控 → Ascend",
  "掌握 PyTorch + vLLM 即可覆盖两套硬件",
  "微调：LLaMA-Factory / ms-swift",
  "RL：MindSpeed RL / verl",
  "推理：vLLM-Ascend",
  "算子：Ascend FlashAttention / DeepEP-Ascend / Ascend C"
], { fontSize: 11 });
footer(s, "建议：以 vLLM-Ascend 作为昇腾推理入口，MindSpeed-LLM 作为训练入口。");

// ---------- Slide 13: Ascend Training Stack (Practice) ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "昇腾大模型训练技术栈", "鹏城实验室昇腾训练实践基础");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "硬件与软件栈", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const stack = [
  ["层级", "组件"],
  ["硬件", "昇腾 910B/910C NPU"],
  ["计算架构", "CANN"],
  ["框架层", "PyTorch（昇腾适配）"],
  ["分布式训练", "MindSpeed-LLM"],
  ["RL 训练", "MindSpeed-RL"],
  ["并行策略", "TP / PP / EP / CP"]
];
s.addTable(stack, {
  x: 0.7, y: 2.1, w: 3.9, h: 2.7,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.5, 2.4],
  autoPage: false
});

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "关键优化技术", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 2.1, 4, 2.8, [
  "昇腾亲和算子：针对 Cube/Vector 单元优化 Attention、MoE Router、FFN",
  "CANN 图编译与算子融合，减少 kernel 启动开销",
  "通信优化：910C 高带宽互联 + 高效 All-to-All/All-Reduce",
  "显存与稳定性：重计算、梯度检查点、ZeRO、异步 Checkpoint、故障恢复"
], { fontSize: 11.5 });
footer(s, "超节点拓扑：16 节点 × 8 卡基础单元，节点内 8 张 910C 通过 HCCS/UB 高速互联。");

// ---------- Slide 14: 7B GRPO + 32B SFT/Offline RL ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "7B GRPO 验证与 32B SFT/Offline RL", "从小规模算法验证到 32B 级领先模型");
card(s, 0.5, 1.45, 4.4, 3.5);
txt(s, "7B GRPO 验证", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const grpo = [
  ["实验", "基座模型", "数据集", "评测集", "结果"],
  ["Exp 1", "Qwen2.5-7B", "GSM8K", "GSM8K", "92.6%"],
  ["Exp 2", "Qwen2.5-7B", "OpenR1-Math", "AIME 2024", "36.7"],
  ["Exp 3", "鹏城脑海 2B", "GSM8K", "GSM8K", "59→74.5"]
];
s.addTable(grpo, {
  x: 0.7, y: 2.1, w: 3.9, h: 1.7,
  fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [0.7, 1.2, 1.1, 0.9, 0.7],
  autoPage: false
});
txt(s, "关键发现：MindSpeed-RL 的 On-Policy GRPO 可稳定训练，为 Offline RL 设计提供参考。", 0.7, 3.95, 3.9, 0.75, { fontSize: 10.5, color: C.muted });

card(s, 5.1, 1.45, 4.4, 3.5);
txt(s, "32B SFT / Offline RL", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const reason = [
  ["模型", "方法", "AIME 2024", "AIME 2025"],
  ["PCL-Reasoner-V1", "SFT", "85.7%", "84.2%"],
  ["PCL-Reasoner-V1.5", "Offline RL", "90.8%", "85.7%"]
];
s.addTable(reason, {
  x: 5.3, y: 2.1, w: 3.9, h: 1.4,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.6, 1.0, 0.9, 0.9],
  autoPage: false
});
stat(s, 5.3, 3.7, 1.8, 0.75, "90.8%", "V1.5 AIME 2024", C.success);
stat(s, 7.3, 3.7, 1.9, 0.75, "32B 领先", "规模级第一", C.accent2);
txt(s, "V1.5 在 32B 规模模型中榜单第一，权重、数据与代码已开源。", 5.3, 4.55, 3.9, 0.35, { fontSize: 10.5, color: C.muted });
footer(s, "数据来源：昇腾大模型实践报告。");

// ---------- Slide 15: Large-scale Training Verification ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "千卡万卡大规模训练验证", "稠密/MoE 模型全栈验证与横向扩展");
const verify = [
  ["模型", "架构", "参数规模", "集群规模", "并行配置", "MFU"],
  ["Llama3", "Dense", "405B", "1024 卡", "TP=8 PP=8 VPP=4 CP=2", "43.62%"],
  ["Llama3", "Dense", "500B (扩展)", "1024 卡", "TP=8 PP=8 VPP=4 CP=2", "40%+"],
  ["DeepSeek-V3-Base", "MOE", "671B", "2048 卡", "TP=2 PP=8 EP=32 CP=1", "23%"],
  ["DeepSeek-V3-Base", "MOE", "1T (扩展)", "2048 卡", "TP=2 PP=8 EP=32 CP=1", "15%+"],
  ["Kimi2-Base", "MOE", "1T", "2048 卡", "TP=2 PP=8 EP=64 CP=1", "15%+"]
];
s.addTable(verify, {
  x: 0.5, y: 1.45, w: 9, h: 2.8,
  fontSize: 10, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [2.0, 1.0, 1.3, 1.1, 2.4, 1.2],
  autoPage: false
});
stat(s, 0.50, 4.45, 2.03, 0.75, "43.62%", "Llama3-405B MFU", C.success);
stat(s, 2.83, 4.45, 2.03, 0.75, "40%+", "Llama3-500B 扩展", C.accent);
stat(s, 5.16, 4.45, 2.03, 0.75, "23%", "DeepSeek-V3-671B", C.accent2);
stat(s, 7.49, 4.45, 2.03, 0.75, "15%+", "万亿参数 MoE", C.accent2);
footer(s, "数据来源：昇腾大模型实践报告。PCL-LLM-Model 与 LongCat 扩展详见后续专页。");

// ---------- Slide 16: LLMEval & Open Source ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "LLMEval 评估框架与开源贡献", "训练、蒸馏、评估一体化与社区开放");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "LLMEval 框架", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.1, 4, 2.8, [
  "接口易用：统一评测接口，降低多模型/多数据集接入成本",
  "性能稳定：支持 vLLM、SGLang，一键多节点自动化评估",
  "任务覆盖广：数学推理、代码生成、通用能力等",
  "生态集成：支撑数据蒸馏、清洗、模型评测全流程"
], { fontSize: 12 });

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "开源贡献与展望", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const os = [
  ["内容", "平台"],
  ["PCL-Reasoner-V1 权重/数据", "HuggingFace / ModelScope"],
  ["PCL-Reasoner-V1.5 权重/报告", "HuggingFace / arXiv"],
  ["训练代码与使用指导", "启智社区 / GitHub"],
  ["LLMEval 评测框架", "Gitee / 启智社区"]
];
s.addTable(os, {
  x: 5.3, y: 2.1, w: 3.9, h: 1.9,
  fontSize: 10.5, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [2.1, 1.8],
  autoPage: false
});
txt(s, "未来：超长序列/MoE 效率、Offline RL 流程、开源生态深度融合。", 5.3, 4.15, 3.9, 0.5, { fontSize: 11, color: C.muted });
footer(s, "PCL-Reasoner-V1/V1.5 均基于 LLMEval 完成评测。");

// ---------- Slide 17: PCL-Reasoner v1/v2 ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "PCL-Reasoner v1 / v1.5", "32B 规模数学推理模型训练实践");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "PCL-Reasoner-V1", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const v1rows = [
  ["属性", "内容"],
  ["基座模型", "Qwen2.5-32B-Base"],
  ["训练数据", "R1-0528 蒸馏数据集"],
  ["训练方法", "监督微调 SFT"],
  ["训练平台", "昇腾 NPU 集群"]
];
s.addTable(v1rows, {
  x: 0.7, y: 2.1, w: 3.9, h: 2.0,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.3, 2.6],
  autoPage: false
});
stat(s, 0.7, 4.25, 1.85, 0.7, "85.7%", "AIME 2024", C.success);
stat(s, 2.65, 4.25, 1.85, 0.7, "84.2%", "AIME 2025", C.success);

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "PCL-Reasoner-V1.5", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const v15rows = [
  ["属性", "内容"],
  ["基座模型", "PCL-Reasoner-V1"],
  ["训练方法", "自研离线强化学习 Offline RL"],
  ["训练平台", "昇腾 NPU 集群"],
  ["地位", "32B 规模模型榜单第一"]
];
s.addTable(v15rows, {
  x: 5.3, y: 2.1, w: 3.9, h: 2.0,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.3, 2.6],
  autoPage: false
});
stat(s, 5.3, 4.25, 1.85, 0.7, "90.8%", "AIME 2024", C.success);
stat(s, 7.25, 4.25, 1.85, 0.7, "85.7%", "AIME 2025", C.success);
footer(s, "模型权重、训练数据与代码已开源至 HuggingFace / ModelScope / 启智社区 / GitHub。");

// ---------- Slide 18: PCL-LLM-Model 万亿 MoE ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "自研万亿参数 MoE 大模型", "PCL-LLM-Model 架构与训练实践");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "模型架构", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const archRows = [
  ["属性", "值"],
  ["架构", "MoE + GQA"],
  ["路由专家数", "128"],
  ["共享专家数", "1"],
  ["专家分组", "8"],
  ["Top-K", "2"],
  ["隐藏维度", "7168"],
  ["FFN 维度", "18432"],
  ["网络层数", "32"],
  ["GQA heads", "64"],
  ["词表大小", "163840"]
];
s.addTable(archRows, {
  x: 0.7, y: 2.1, w: 3.9, h: 2.9,
  fontSize: 10.5, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.5, 2.4],
  autoPage: false
});

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "训练规模与并行配置", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 5.3, 2.1, 4, 1.4, [
  "训练规模：2048 卡（4096 Die）",
  "数据集：5T tokens",
  "训练时长：30 天",
  "集群拓扑：16 节点 × 8 卡超节点"
], { fontSize: 12 });
const parallelRows = [
  ["并行策略", "配置"],
  ["TP 张量并行", "2"],
  ["PP 流水线并行", "8"],
  ["EP 专家并行", "64"],
  ["CP 序列并行", "1"]
];
s.addTable(parallelRows, {
  x: 5.3, y: 3.55, w: 3.9, h: 1.45,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [1.8, 2.1],
  autoPage: false
});
footer(s, "借鉴 DeepSeek-V3 与 Qwen3 架构，针对昇腾硬件进行亲和性优化。");

// ---------- Slide 19: LongCat-Flash-Chat 横向扩展 ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "LongCat-Flash-Chat 横向扩展", "560B → 万亿参数规模扩展训练");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "扩展方案", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 2.1, 4, 2.8, [
  "扩展方式：横向扩展（Width Scaling）",
  "训练框架：MindSpeed-LLM",
  "硬件需求：最少仅需 2 个超节点（256 Die）",
  "精度保持：推理精度与原 LongCat-Flash-Chat 一致",
  "基准复现：多个评测集上均能复现相同结果",
  "验证意义：证明昇腾生态支持第三方开源大模型高效扩展训练"
], { fontSize: 12 });

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "关键结论", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
stat(s, 5.3, 2.1, 2.0, 0.8, "Width", "Scaling 方式", C.accent2);
stat(s, 7.4, 2.1, 1.8, 0.8, "2", "超节点起", C.accent2);
stat(s, 5.3, 3.05, 2.0, 0.8, "560B", "原模型规模", C.accent);
stat(s, 7.4, 3.05, 1.8, 0.8, "1T+", "扩展后规模", C.accent);
txt(s, "MindSpeed-LLM 在 MoE/稠密混合架构上展现出良好的灵活性与扩展性。", 5.3, 4.0, 3.9, 0.8, { fontSize: 12, color: C.muted });
footer(s, "数据来源：昇腾大模型实践报告。");

// ---------- Slide 20: Other Parts Summary ----------
s = pres.addSlide();
s.background = { color: C.bg };
sectionTitle(s, "其他关键成果与展望", "7B GRPO 验证 · LLMEval · 开源贡献 · 未来方向");
card(s, 0.5, 1.45, 4.4, 3.6);
txt(s, "7B GRPO 验证", 0.7, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const grpoRows2 = [
  ["实验", "基座模型", "评测集", "结果"],
  ["Exp 1", "Qwen2.5-7B", "GSM8K", "92.6%"],
  ["Exp 2", "Qwen2.5-7B", "AIME 2024", "36.7"],
  ["Exp 3", "鹏城脑海 2B", "GSM8K", "59→74.5"]
];
s.addTable(grpoRows2, {
  x: 0.7, y: 2.1, w: 3.9, h: 1.6,
  fontSize: 11, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [0.8, 1.4, 1.0, 0.9],
  autoPage: false
});
txt(s, "LLMEval 评估框架", 0.7, 3.85, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
bullets(s, 0.7, 4.25, 4, 0.7, [
  "统一评测接口、支持 vLLM/SGLang、一键多节点自动化评估"
], { fontSize: 10.5 });

card(s, 5.1, 1.45, 4.4, 3.6);
txt(s, "开源贡献与展望", 5.3, 1.65, 4, 0.4, { fontSize: 17, bold: true, color: C.accent });
const osRows2 = [
  ["内容", "平台"],
  ["PCL-Reasoner-V1 权重/数据", "HuggingFace / ModelScope"],
  ["PCL-Reasoner-V1.5 权重/报告", "HuggingFace / arXiv"],
  ["训练代码与使用指导", "启智社区 / GitHub"],
  ["LLMEval 评测框架", "Gitee / 启智社区"]
];
s.addTable(osRows2, {
  x: 5.3, y: 2.1, w: 3.9, h: 1.9,
  fontSize: 10.5, color: C.text,
  border: { pt: 0.5, color: C.cardLight },
  fill: { color: C.card },
  colW: [2.1, 1.8],
  autoPage: false
});
bullets(s, 5.3, 4.15, 4, 0.8, [
  "未来：超长序列/MoE 效率、Offline RL、开源生态深度融合"
], { fontSize: 10.5 });
footer(s, "PCL-Reasoner-V1/V1.5 均基于 LLMEval 完成评测。");

// ---------- Slide 21: Closing ----------
s = pres.addSlide();
s.background = { color: C.bg };
s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.bg } });
s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.9, w: 0.12, h: 1.7, fill: { color: C.accent } });
txt(s, "谢谢", 0.8, 1.8, 8, 0.9, { fontSize: 50, bold: true });
txt(s, "Questions & Discussion", 0.8, 2.7, 8, 0.7, { fontSize: 28, color: C.accent });
txt(s, "GPU 与昇腾大模型生态调研与实践", 0.8, 3.6, 8, 0.4, { fontSize: 14, color: C.muted });

pres.writeFile({ fileName: "/Users/robin/work_dir/oh-my-claude-code/昇腾大模型生态调研与实践.pptx" })
  .then(() => console.log("PPT created: 昇腾大模型生态调研与实践.pptx"))
  .catch((err) => console.error(err));
