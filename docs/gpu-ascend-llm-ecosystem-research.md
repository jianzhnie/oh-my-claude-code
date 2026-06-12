# `GPU` 与 Ascend 大模型训练推理生态调研

> 调研日期：2026/06/12
> 范围：NVIDIA GPU 生态、华为昇腾（Ascend）NPU 生态在大模型训练与推理两个场景下的分层对比，主流社区框架、关键融合算子对 Ascend NPU 的支持现状，以及超大规模模型在 Ascend NPU 上的训练实践。

---

## 目录

1. [生态全景图](#一生态全景图)
2. [大模型训练生态对比](#二大模型训练生态对比)
   - 2.1 [训练硬件对比](#21-训练硬件对比)
   - 2.2 [训练软件栈对比](#22-训练软件栈对比)
   - 2.3 [分布式训练框架与并行策略](#23-分布式训练框架与并行策略)
   - 2.4 [混合精度与训练优化](#24-混合精度与训练优化)
   - 2.5 [训练场景选型建议](#25-训练场景选型建议)
   - 2.6 [超大规模模型在 Ascend NPU 上的训练实践](#26-超大规模模型在-ascend-npu-上的训练实践)
3. [大模型推理生态对比](#三大模型推理生态对比)
   - 3.1 [推理硬件对比](#31-推理硬件对比)
   - 3.2 [推理软件栈对比](#32-推理软件栈对比)
   - 3.3 [推理优化技术](#33-推理优化技术)
   - 3.4 [推理部署模式](#34-推理部署模式)
   - 3.5 [推理场景选型建议](#35-推理场景选型建议)
4. [社区框架与工具对 Ascend NPU 的支持](#四社区框架与工具对-ascend-npu-的支持)
   - 4.1 [训练与微调框架](#41-训练与微调框架)
   - 4.2 [RL / Post-Training 框架](#42-rl--post-training-框架)
   - 4.3 [推理引擎](#43-推理引擎)
   - 4.4 [Hugging Face 生态](#44-hugging-face-生态)
   - 4.5 [选型速查表](#45-选型速查表)
5. [关键融合算子与加速库](#五关键融合算子与加速库)
   - 5.1 [FlashAttention / MLA](#51-flashattention--mla)
   - 5.2 [DeepEP / MoE 通信优化](#52-deepep--moe-通信优化)
   - 5.3 [其他关键融合算子](#53-其他关键融合算子)
   - 5.4 [算子开发工具](#54-算子开发工具)
6. [其他竞争者](#六其他竞争者简要)
7. [趋势判断](#七趋势判断)
8. [结论](#八结论)
9. [TCO 与成本效益分析](#九tco-与成本效益分析)
10. [版本兼容矩阵](#十版本兼容矩阵)
11. [CUDA 到 Ascend 迁移路径与成本](#十一cuda-到-ascend-迁移路径与成本)
12. [实测性能基准](#十二实测性能基准)
13. [多模态与 Agent 生态](#十三多模态与-agent-生态)
14. [集群网络与互联拓扑](#十四集群网络与互联拓扑)
15. [推理部署工程实践](#十五推理部署工程实践)
16. [故障恢复与长稳训练](#十六故障恢复与长稳训练)
17. [参考来源](#十七参考来源)

---

## 一、生态全景图

| 层级 | GPU 生态（NVIDIA） | Ascend 生态（华为） | 说明 |
| :--- | :--- | :--- | :--- |
| **应用层** | GPT、Claude、Llama、Grok 等 | 盘古、DeepSeek-V4、GLM、LongCat 等 | 模型与硬件解耦，可跨平台部署 |
| **训练框架** | PyTorch、JAX、TensorFlow | MindSpore（原生）+ PyTorch（torch_npu 插件） | PyTorch 通过 torch_npu 插件支持 Ascend NPU |
| **分布式训练** | Megatron-LM、DeepSpeed、FSDP | MindSpeed-LLM、MindSpeed-MM、MindSpeed-RL | DeepSpeed 通过 torch_npu / Ascend 适配分支支持 NPU |
| **推理引擎** | vLLM、TensorRT-LLM 4.0、SGLang | **vLLM-Ascend**、SGLang、MindIE | vLLM-Ascend 已成为昇腾推理主入口 |
| **算子开发** | CUDA、Triton、CUTLASS | Ascend C、TBE、Ascend-Triton | 自定义 kernel 与融合算子 |
| **加速库** | cuBLAS、cuDNN、cuDNN-frontend | AscendCL、ATB、算子库 | 底层矩阵/注意力/融合算子 |
| **通信库** | NCCL 2.21+ | HCCL | 多卡/多节点集合通信 |
| **运行时/编译器** | CUDA Runtime、CUDA Graph | CANN（GE 图引擎 + MindIR + AOE） | 图编译、算子调度、自动调优 |
| **性能分析** | Nsight Systems/Compute、PyTorch Profiler | MindStudio Insight / Profiler | 性能定位与可视化 |
| **开发工具** | Nsight、TensorBoard | MindStudio、ModelArts | 开发、转换、云化平台 |
| **硬件平台** | H100 / H200 / B200 / GB200 | 910B / 910C / 950PR / 950DT / 960（路线图） | 950PR/DT 为 2026 年新品；960/970 为 2027–2028 年规划 |
| **互联方案** | NVLink + NVSwitch + InfiniBand/RoCE | HCCS + 超节点互联（CloudMatrix / SuperPoD） | 集群级设计成为新竞争焦点 |

---

## 二、大模型训练生态对比

### 2.1 训练硬件对比

| 维度 | NVIDIA GPU | Ascend NPU |
| :--- | :--- | :--- |
| **主力训练芯片** | H100 SXM5、H200 SXM5、B200 SXM6 | Ascend 910B、910C、950DT（2026 年 Q4） |
| **下一代旗舰** | GB200 NVL72（机架级） | Ascend 950DT（2026 年）、960/970（2027–2028 年路线图） |
| **峰值 BF16 算力** | H100: 989 TFLOPS；B200: ~4,500 TFLOPS | 910B: ~376 TFLOPS；910C: ~780 TFLOPS；950DT: ~1,000 TFLOPS（目标） |
| **显存容量** | H100 80GB → H200 141GB → B200 192GB | 910B 64GB → 910C **128GB** → 950PR **128GB** → 950DT **144GB** |
| **显存带宽** | H100 3.35 TB/s → B200 8.0 TB/s | 910B ~1.6 TB/s → 910C **3.2 TB/s** → 950PR **1.6 TB/s** → 950DT **4 TB/s** |
| **互联带宽** | NVLink 4: 900 GB/s；NVLink 5: 1.8 TB/s | 910B HCCS ~196 GB/s 单向；910C ~784 GB/s；CloudMatrix 384 UB 面 ~392 GB/s/卡 |
| **集群形态** | DGX/HGX + IB/RoCE 网络 | Atlas 800 训练服务器 + CloudMatrix/SuperPoD |
| **能效/散热** | B200 单卡 1000W，GB200 机架需液冷 | 910B 约 310W~400W，超节点亦倾向液冷 |

**关键差异**：NVIDIA 在单卡算力、显存带宽、互联成熟度上领先；Ascend 通过 **超节点架构** 和 **国产化供应** 弥补单卡差距，在政府、金融、电信等 closed market 渗透。

### 2.2 训练软件栈对比

| 层级 | NVIDIA GPU | Ascend NPU |
| :--- | :--- | :--- |
| **框架层** | PyTorch、JAX、TensorFlow 原生支持 | MindSpore（原生）+ PyTorch via torch_npu |
| **分布式框架** | Megatron-LM、DeepSpeed、FSDP、Colossal-AI | MindSpeed-LLM、MindSpeed-MM、MindSpeed-RL |
| **通信库** | NCCL | HCCL |
| **算子库** | cuBLAS、cuDNN、cuDNN-frontend | AscendCL、ATB、算子库 |
| **Kernel 开发** | CUDA、Triton、CUTLASS | Ascend C、TBE、Ascend-Triton |
| **编译/运行时** | CUDA Runtime、CUDA Graph、nvFuser | CANN（GE + MindIR + AOE 自动调优） |
| **Profiler** | Nsight Systems/Compute、PyTorch Profiler | MindStudio Insight、CANN Profiler |

**迁移体验**：据公开资料，95% 以上 PyTorch CUDA 代码可通过 `torch_npu` 插件在 Ascend 上运行，但性能敏感部分（如自定义 CUDA kernel、MoE All-to-All、FlashAttention 变体）通常需要针对 Ascend 重写或调用华为/社区优化算子。

### 2.3 分布式训练框架与并行策略

| 并行策略 | GPU 生态实现 | Ascend 生态实现 |
| :--- | :--- | :--- |
| **数据并行（DP）** | PyTorch DDP、FSDP、DeepSpeed ZeRO | MindSpeed-LLM DP、HCCL All-Reduce |
| **张量并行（TP）** | Megatron-LM TP、PyTorch Tensor Parallel | MindSpeed-LLM TP（ intra-node ） |
| **流水线并行（PP）** | Megatron-LM PP、DeepSpeed Pipeline | MindSpeed-LLM PP |
| **序列并行（SP）** | Megatron-LM SP、DeepSpeed Ulysses | MindSpeed-LLM SP、LongSeq 优化 |
| **专家并行（EP）** | Megatron-LM MoE EP、DeepSpeed-MoE | MindSpeed-LLM EP、EPLB（Expert Parallelism Load Balance） |
| **上下文并行（CP）** | Ring Attention、Striped Attention | MindSpeed-LLM CP |
| **3D/4D 并行组合** | Megatron-LM 成熟 | MindSpeed-LLM 快速追赶 |

**训练框架细节**：

- **Megatron-LM（GPU）**：NVIDIA 官方维护，GPT/LLaMA/MoE 模型训练的事实标准，TP/PP/DP/CP/EP 组合成熟，与 NCCL 深度优化。
- **DeepSpeed（GPU）**：微软开源，ZeRO-1/2/3/Fusion 优化显存，适合中小团队；通过 torch_npu / Ascend 适配分支支持 NPU。
- **MindSpeed-LLM（Ascend）**：华为大模型训练核心框架，2026 年支持 FSDP2、QLoRA NF4、DPO/GRPO 对齐、长序列并行、MoE EPLB 等。
- **MindSpeed-RL（Ascend）**：面向 RLHF/RL 的分布式数据流框架，vLLM-Ascend 作为 generation engine。

### 2.4 混合精度与训练优化

| 技术 | NVIDIA GPU | Ascend NPU |
| :--- | :--- | :--- |
| **FP16/BF16** | 全系列支持，BF16 为训练主流 | 全系列支持，BF16 为主流 |
| **FP8** | Hopper 原生 FP8；Blackwell MXFP8 块级缩放 | 910B/C 非原生 FP8（CANN 软件转换/量化推理）；950PR/DT 原生支持 FP8/MXFP8/HiF8 |
| **FP4** | Blackwell 原生 FP4（推理为主） | 970 规划支持 |
| **梯度缩放** | Transformer Engine、自动 loss scaling | CANN 自动混合精度、梯度缩放 |
| **显存优化** | 梯度检查点、ZeRO、Offload、激活重计算 | 相同技术，MindSpeed-LLM 内置 |
| **通信优化** | NCCL Tree/Ring、PXN、GDR、CUDA Graph | HCCL Ring/Mesh、HCCS 亲和性、NPU Graph EX |
| **长上下文** | Ring Attention、FlashAttention-3 | FlashAttention Ascend 版、LongSeq 优化 |

**关键差距**：FlashAttention-3、FP8/MXFP8 极致 kernel、MoE All-to-All 等性能敏感算子在 Ascend 上仍需华为或头部厂商持续手写优化；通用训练已可平滑迁移。

### 2.5 训练场景选型建议

| 场景 | 推荐平台 | 理由 |
| :--- | :--- | :--- |
| 千亿参数预训练 | NVIDIA B200 / GB200 | 单卡算力、显存、互联、框架成熟度最优 |
| 百亿~千亿参数微调 | H100/H200 或 Ascend 910C | H200 显存大适合长上下文；Ascend 适合合规场景 |
| RLHF / GRPO 对齐 | GPU（Megatron/DeepSpeed）或 Ascend（MindSpeed RL） | GPU 生态成熟；Ascend 可用 vLLM-Ascend + MindSpeed RL |
| 长上下文训练（128K+） | H200 / B200 或 Ascend 超节点 | 显存容量和 CP/SP 优化是关键 |
| 国产化/政策合规训练 | Ascend 910C / CloudMatrix | 供应链安全、整机方案、本地化服务 |

### 2.6 超大规模模型在 Ascend NPU 上的训练实践

随着昇腾芯片与 CANN/MindSpeed 软件栈的成熟，2024-2026 年已有多个超大规模模型在 Ascend NPU 上完成训练或进行大规模训练验证。以下按厂商/模型分类整理。

#### 华为盘古系列（昇腾原生）

| 模型 | 参数规模 | 训练集群 | 关键指标 | 意义 |
| :--- | :--- | :--- | :--- | :--- |
| **盘古 Ultra** | 135B Dense | **8192 张昇腾 NPU** | MFU **50%**；13.2T tokens；全流程无 loss 突刺长稳训练 | 首个纯昇腾训练、性能比肩 Llama 405B 的稠密大模型 |
| **盘古 Ultra MoE** | 718B（激活 39B） | 6000+ 张 / 万卡级昇腾集群（CloudMatrix 384 超节点） | 初始 MFU 18.9% → 6K 卡 **30%** → 万卡 **41%**；实验室优化达 **45%**；256 路由专家，动态激活 8 专家 | 准万亿参数 MoE，性能媲美 DeepSeek-R1 |
| **盘古 Pro MoE** | 72B（激活 16B） | **4000 颗昇腾 NPU** | 13T tokens；三阶段预训练 | 2025 年 6 月开源，千亿内参数领先 |
| **盘古 Embedded** | 7B | 昇腾 NPU | 端侧小模型 | 开源轻量模型 |

**训练技术创新**：Depth-Scaled Sandwich-Norm（DSSN）稳定架构、TinyInit 小初始化、EP-Group 负载均衡、Dropless 训练策略、MLA、MTP 等。

#### DeepSeek 系列

| 模型 | Ascend 训练情况 | 备注 |
| :--- | :--- | :--- |
| **DeepSeek-V3** | 官方报告使用 2048 张 NVIDIA H800 训练；后续在昇腾 910B 上完成适配与训练验证 | 原生 CUDA 路径，但成为国内昇腾训练对标和迁移的重要目标 |
| **DeepSeek-V4** | **首个公开宣称与昇腾完成全栈适配的万亿参数级 frontier 模型**；V4-Pro 1.6T（激活 49B），V4-Flash 284B（激活 13B）；主要基于 Ascend 910B 千卡集群进行训练验证与适配优化；CANN 重写 200+ 算子 | 2026 年 4 月发布，标志着国产芯片可承载万亿参数级模型训练与推理；实际训练可能采用 GPU+NPU 混合路径 |
| **DeepSeek-R1/R2** | R1 主要基于 NVIDIA；R2 曾在 Ascend 上尝试训练但遇到稳定性与通信效率问题，后回归 NVIDIA | Ascend 在超大规模 RL 训练上仍需持续优化 |

**关键数据**：DeepSeek-V4 基于 Ascend 910B 千卡集群完成训练验证与适配优化，CANN 重写 200+ 算子；单卡 910B BF16 性能约 376 TFLOPS，910C 约 780 TFLOPS。其在昇腾上的端到端训练效率与 H100 的差距尚无公开权威 benchmark，实际表现高度依赖 CANN 版本、并行策略与算子优化程度。

#### 美团 LongCat 系列

| 模型 | Ascend 训练情况 | 关键信息 |
| :--- | :--- | :--- |
| **LongCat-2.0-Preview** | **2026 年 4 月发布，约 1.6 万亿参数（激活 480 亿），基于 5–6 万张以华为昇腾为主的国产算力卡完成预训练** | 目前公开确认的国产算力最大规模训练任务；支持 1M 上下文；邀请制测试 |
| **LongCat-Flash** | 560B MoE；完整昇腾适配方案 | vLLM-Ascend 0.13.0+ 已支持 |
| **LongCat-Video / LongCat-Image-Edit** | 昇腾 NPU 已完成适配与验证 | 提供 AtomGit 适配文档，支持 Ascend 910B3 + CANN 8.0+ |

**关键意义**：LongCat-2.0 与 DeepSeek-V4 同日发布，形成独立验证——国产昇腾芯片已能支撑前沿级万亿参数大模型训练。

#### 讯飞星火系列

| 模型 | 训练平台 | 关键信息 |
| :--- | :--- | :--- |
| **讯飞星火 V3.0/V3.5/V4.0** | **"飞星一号"**（昇腾 910B 万卡集群） | 首个全国产算力训练的大模型；训练效率从 30%-50% 优化至 A100 的 85%-95% |
| **讯飞星火 V4.0 Turbo** | "飞星一号"/"飞星二号" | 完全基于昇腾算力原生开发 |
| **讯飞星火 X1** | **"飞星二号"**（万亿参数训练能力） | 深度推理模型，对标 OpenAI o1、DeepSeek-R1 |
| **讯飞星火 X2-Flash（2026.04）** | **昇腾 910B 集群** | 30B MoE、256K 上下文；同规模 A800 训练效率从 20% 提升至 **90%** |

#### 百度 ERNIE / 文心

| 模型 | Ascend 训练情况 | 关键指标 |
| :--- | :--- | :--- |
| **ERNIE 4.5** | 2025 年开源，PaddlePaddle 支持昇腾 NPU 适配与训练；官方技术报告披露的 MFU 数据基于 NVIDIA H800 | 300B 总参 / 47B 激活（A47B）MoE；预训练 MFU **47%**（H800）；FP8 混合精度；3D 混合并行 |
| **文心系列** | 已有昇腾适配版本，支持在昇腾上进行训练与推理 | 百度与华为在大模型国产化上有持续合作 |

#### 智谱 GLM 系列

| 模型 | Ascend 训练情况 | 关键信息 |
| :--- | :--- | :--- |
| **GLM-4.5** | 355B（激活 32B）/ GLM-4.5-Air 106B（激活 12B）MoE；后训练基于 **slime 框架** | 23T tokens；128K 输入 / 96K 输出；slime 支持昇腾后端 |
| **GLM-Image** | **首个基于自主创新算力底座（昇腾 + 昇思 MindSpore）全程训练的 SOTA 多模态模型** | 昇腾 Atlas 800T A2 + MindSpore；动态图多级流水下发、多流并行、昇腾亲和高性能融合算子 |

#### 通义千问 Qwen 系列

| 模型 | Ascend 训练情况 | 关键信息 |
| :--- | :--- | :--- |
| **Qwen3 / Qwen2.5-VL 等** | 华为云 ModelArts 官方支持 **昇腾 NPU 训练** | 支持预训练、SFT 全参微调、LoRA、GRPO 强化学习 |
| **Qwen2.5-7B GRPO 案例** | 昇腾 NPU 强化学习训练 | 数独任务准确率从 41.6% 提升至 **89.6%** |

#### 其他国产模型与平台

| 项目 | Ascend 训练情况 |
| :--- | :--- |
| **昇腾 384 超节点 / Atlas 900 A3 SuperPoD** | **384 颗昇腾 910C** + 192 颗鲲鹏 CPU，MatrixLink 全对等互联；BF16 稠密算力 300 PFLOPS、HBM 总容量 48 TB；支持万亿/十万亿参数大模型训练，算力利用率 45%+ |
| **中国移动/电信/联通等运营商大模型** | 大量基于昇腾集群训练的行业/政企大模型 |
| **金融行业大模型** | 工商银行、建设银行等基于昇腾训练专属大模型 |

#### 训练实践总结

| 维度 | 现状 |
| :--- | :--- |
| **可用规模** | 从千卡到万卡级昇腾集群已可训练百亿~准万亿参数模型 |
| **代表模型** | 盘古 Ultra/Ultra MoE、DeepSeek-V4、LongCat-2.0（1.6T/48B）、讯飞星火 X2-Flash、ERNIE 4.5（昇腾适配）、GLM-4.5/GLM-Image、Qwen 系列 |
| **算力利用率** | 稠密模型可达 **50%**（盘古 Ultra）；MoE 模型可达 **41%**（盘古 Ultra MoE，万卡）；ERNIE 4.5 在 H800 上达 **47%** |
| **与 NVIDIA 差距** | 单卡 BF16 算力：910B 约 H100 的 38%，910C 约 79%；集群训练效率约为 H100/H800 的 35%~70%，依赖超节点和软件优化弥补 |
| **关键挑战** | 超长稳训练稳定性、MoE All-to-All 通信、FP8 极致优化、大规模 RL 训练 |
| **发展趋势** | 2026 年 Q4 Ascend 950DT 上市后，2027–2028 年 960/970 逐步落地，训练效率有望进一步接近 NVIDIA |

---

## 三、大模型推理生态对比

### 3.1 推理硬件对比

| 维度 | NVIDIA GPU | Ascend NPU |
| :--- | :--- | :--- |
| **主力推理芯片** | H100、H200、B200、L40S、RTX 4090/5090 | Ascend 310P、910B/C、950PR |
| **推理专用芯片** | B200（FP4 推理）、L40S | 950PR（推理优化） |
| **显存容量** | H200 141GB、B200 192GB 适合大模型单卡部署 | 910B 64GB、950PR 128GB、950DT 144GB |
| **INT8/FP8/FP4 支持** | 全系列成熟，TensorRT-LLM 深度优化 | 910B/C INT8 成熟、FP8 为软件层支持；950PR/950DT 原生 FP8/FP4 |
| **推理能效** | L40S/RTX 系列在离线推理性价比高 | 310P 在边缘推理有布局，Atlas 800I 用于数据中心 |
| **集群推理** | DGX/HGX + vLLM/TensorRT-LLM | Atlas 800I A2/A3 + vLLM-Ascend/MindIE |

**关键差异**：推理对单卡峰值算力要求低于训练，但对 **显存容量、量化支持、连续批处理、KV Cache 效率** 更敏感。Ascend 在推理侧与 NVIDIA 差距最小。

### 3.2 推理软件栈对比

| 层级 | NVIDIA GPU | Ascend NPU |
| :--- | :--- | :--- |
| **服务化引擎** | vLLM、TensorRT-LLM 4.0、SGLang、TGI | **vLLM-Ascend**、MindIE、SGLang（适配中） |
| **量化工具** | TensorRT-LLM、AutoGPTQ、AWQ、GPTQ | MindIE Turbo（已并入 vLLM-Ascend）、AOE 量化 |
| **Attention 优化** | FlashAttention-2/3、PageAttention | Ascend FlashAttention、PageAttention Ascend 版 |
| **Serving 框架** | Triton Inference Server、NVIDIA NIM | MindIE-Service、ModelArts 推理 |
| **KV Cache 管理** | vLLM PagedAttention、LMCache | vLLM-Ascend KV Pooling、LMCacheAscendConnector |
| **PD 分离** | vLLM / SGLang PD disaggregation | vLLM-Ascend PD 分离、MindIE 原生前后端分离 |
| **Profiler** | Nsight、PyTorch Profiler | MindStudio Insight、CANN Profiler |

**vLLM-Ascend 现状**：

- 2026 年 vLLM-Ascend 已支持 DeepSeek-V3/V4、Qwen3、GLM5、Kimi-K2、MiniMax-m2 等主流模型。
- MindIE Turbo 功能已合并入 vLLM-Ascend，无需单独安装。
- 支持 ACLGraph / NPU Graph EX、连续批处理、PD 分离、EPLB、投机解码、C8 INT8 KV Cache 等。

### 3.3 推理优化技术

| 技术 | GPU 生态 | Ascend 生态 |
| :--- | :--- | :--- |
| **连续批处理（Continuous Batching）** | vLLM、TensorRT-LLM、SGLang 标配 | vLLM-Ascend、MindIE 标配 |
| **PageAttention / Paged KV Cache** | vLLM 首创，SGLang 支持 | vLLM-Ascend 移植并优化 |
| **量化推理** | FP16 → INT8/INT4/FP4/AWQ/GPTQ/FP8 | INT8/FP8 为主，C8 INT8 KV Cache 已支持 |
| **投机解码（Speculative Decoding）** | Medusa、Eagle、Lookahead | Eagle3 + MiniMax-M2.5 等已支持 |
| **Prefix Caching** | vLLM、SGLang | vLLM-Ascend 支持 |
| **PD 分离** | vLLM / SGLang | vLLM-Ascend / MindIE |
| **多机推理 / 张量并行** | TensorRT-LLM TP/PP、vLLM TP | vLLM-Ascend TP/PP、MindIE 多机 |
| **KV Cache 压缩** | GQA、MLA、KV Cache 量化 | 同技术路线，vLLM-Ascend 适配 |

**量化趋势**：两阵营都在向 **FP4/INT4 权重量化 + FP8/INT8 KV Cache** 演进，以降低显存占用并提升吞吐。B200 原生 FP4 在 GPU 侧领先；Ascend 950/960 系列正在快速补齐。

### 3.4 推理部署模式

| 部署模式 | GPU 生态 | Ascend 生态 |
| :--- | :--- | :--- |
| **单卡本地推理** | Ollama、llama.cpp、vLLM | vLLM-Ascend、MindIE |
| **单机多卡服务** | vLLM、TensorRT-LLM、Triton | vLLM-Ascend、MindIE-Service |
| **多机集群推理** | vLLM + IB/RoCE、TensorRT-LLM + NCCL | vLLM-Ascend + HCCL、MindIE |
| **云原生 / K8s** | Triton + K8s、vLLM production stack | MindIE + ModelArts + 华为云 CCE |
| **边缘推理** | Jetson、RTX 系列 | Ascend 310P 边缘设备 |
| **Serverless/API** | NVIDIA NIM、Fireworks、Together | 华为云 ModelArts、昇腾云服务 |

### 3.5 推理场景选型建议

| 场景 | 推荐平台 | 理由 |
| :--- | :--- | :--- |
| 高吞吐在线服务（70B+） | H200 / B200 + vLLM/TensorRT-LLM | 显存大、量化成熟、吞吐极限高 |
| 国产化在线服务 | Ascend 910C/950PR + vLLM-Ascend | 供应链安全，接口与 vLLM 一致 |
| 长上下文推理（128K+） | H200 / B200 或 Ascend 950PR | 显存容量决定可服务上下文长度 |
| MoE 模型推理（DeepSeek-V3/V4） | B200 或 Ascend 910C/950PR | EP + 量化 + 通信优化是关键 |
| 边缘/端侧推理 | NVIDIA Jetson/RTX 或 Ascend 310P | 功耗和成本优先 |
| 快速 PoC / 统一接口 | vLLM（GPU）或 vLLM-Ascend（NPU） | 同一套 API，迁移成本最低 |

---

## 四、社区框架与工具对 Ascend NPU 的支持

随着 `torch_npu` 和 CANN 的成熟，2024-2026 年大量开源社区框架已完成或正在完成对 Ascend NPU 的适配。以下按训练/微调、RL/Post-Training、推理、Hugging Face 生态四个维度整理。

### 4.1 训练与微调框架

#### LLaMA-Factory

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 统一高效微调框架，支持 100+ LLM/VLM |
| **Ascend 支持状态** | ✅ 官方支持（2024 年 5 月宣布） |
| **支持硬件** | Atlas A2/A3 训练系列、Atlas 800I A2 推理系列、Ascend 910B（32GB/64GB） |
| **支持功能** | PT / SFT / RM / DPO；Full / Freeze / LoRA；DDP / FSDP / FSDP2 / DeepSpeed |
| **优化算子** | NpuFusedRMSNorm、NpuFusedSwiGlu、NpuFusedRoPE、NpuFusedMoE |
| **部署方式** | Docker 镜像 `hiyouga/llamafactory:latest-npu-a2` 或 pip 安装 `pip install -e ".[torch-npu,metrics]"` |
| **注意事项** | Python 3.10 推荐；QLoRA（bitsandbytes）在 NPU 上存在限制 |

#### ms-swift（ModelScope）

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 阿里巴巴 ModelScope 出品的 LLM/VLM 训练、推理、部署一站式框架 |
| **Ascend 支持状态** | ✅ 官方完整支持，有专门 NPU 文档 |
| **支持训练** | CPT、SFT、DPO、RM、GRPO、PPO |
| **支持并行** | DDP、FSDP、FSDP2、DeepSpeed、MindSpeed（Megatron） |
| **支持 PEFT** | Full、LoRA；⚠️ QLoRA 不支持 |
| **支持部署** | PT、vLLM-Ascend；⚠️ SGLang 暂不支持 |
| **典型环境** | CANN ≥ 8.5.1，PyTorch/torch_npu ≥ 2.7.1，vLLM-Ascend 0.18.0+ |
| **特色** | 自动 NPU 模型 patch，ModelScope 模型一键下载，适合国产化落地 |

### 4.2 RL / Post-Training 框架

#### verl

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 火山引擎开源的灵活、高效、生产级 RL 训练框架 |
| **Ascend 支持状态** | ✅ 2026 年 Q1-Q2 将 Ascend NPU 作为一等公民支持 |
| **训练后端** | MindSpeed-LLM、MindSpeed-MM、Megatron-LM、FSDP |
| **推理引擎** | vLLM-Ascend、SGLang |
| **支持硬件** | Atlas 200T A2、Atlas 900 A2 PODc、Atlas 800T A3 |
| **典型版本** | CANN 9.0.0、PyTorch 2.9.0、torch_npu 2.9.0.post2、vLLM-Ascend 0.18.0 |
| **2026 Q2 重点** | Qwen3.5、DeepSeek-V4、GLM-5 支持；mxfp8/int8 rollout；GPU/NPU 行为一致性 |

#### OpenRLHF（社区版）

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 开源 RLHF 框架，支持 PPO/GRPO/DPO/KTO/REINFORCE++ |
| **Ascend 支持状态** | ⚠️ 社区维护版（非华为官方），基于 OpenRLHF v0.6.2 适配 |
| **支持算法** | SFT、DPO、KTO、RM/PRM、REINFORCE++、GRPO、PPO |
| **依赖版本** | CANN 8.0.RC3/8.1.RC1、torch/torch_npu 2.5.1、vLLM-Ascend 0.7.3、DeepSpeed |
| **限制** | 不支持 Ring Attention、Hybrid Engine、PyTorch Compile、bitsandbytes、flash-attn（用 `npu_fusion_attention` 替代） |

#### MindSpeed RL（华为官方）

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 华为官方面向 Ascend NPU 集群的 RL 训练框架 |
| **架构** | vLLM-Ascend 作为 generation engine，MindSpeed 作为 training engine |
| **支持算法** | PPO、GRPO、PF-PPO、DAPO、DPO 等 |
| **并行策略** | TP、PP、DP、CP、EP、All2All EP |
| **特色优化** | Transfer Dock、Allgather-Swap、融合算子（FlashAttention、RMSNorm、RoPE、SwiGLU、MatmulAdd、GMM） |
| **性能** | 相比 OpenRLHF/VeRL 吞吐提升 **1.42× ~ 3.97×** |
| **状态** | 2026 年 4 月宣布完成既定开发目标，后续以迭代优化为主；新特性建议迁移至 verl 昇腾实践 |

#### slime-ascend

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 智谱 AI 的 LLM Post-Training / RL scaling 框架（slime v0.2.4 昇腾适配版） |
| **项目地址** | `gitcode.com/Ascend/slime-ascend` |
| **架构** | Megatron + SGLang |
| **支持模型** | GLM-5、Qwen3、DeepSeek V3/V3.1/R1、Llama 3 |
| **用途** | GLM-5 等模型的后训练与 RL 训练 |

### 4.3 推理引擎

#### vLLM-Ascend

| 项目 | 详情 |
| :--- | :--- |
| **定位** | vLLM 官方社区维护的 Ascend NPU 插件 |
| **状态** | ✅ 昇腾推理的事实标准入口 |
| **支持模型** | DeepSeek-V3/V4、Qwen3/3.5、GLM5、Kimi-K2、MiniMax-m2 等 |
| **核心特性** | ACLGraph / NPU Graph EX、连续批处理、PD 分离、EPLB、投机解码、C8 INT8 KV Cache、KV Pooling |
| **版本** | v0.18.0（稳定）、v0.19.1rc1（预览） |

#### SGLang

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 高性能 LLM Serving 引擎，擅长结构化生成和复杂前端 |
| **Ascend 支持状态** | ✅ 2025 年 7 月起官方支持，2026 年 Q1-Q2 持续迭代 |
| **2026 Q2 重点** | PD 分离、投机解码、层次化 Cache（HiCache）、Mooncake NPU、K8s/LWS/RBG 大规模部署、950RP/DT 优化 |
| **支持模型** | DeepSeek-V2/V3/V3.2/V4、Kimi-K2、Qwen3/Qwen3-MoE/Qwen3-Next、LongCat、多模态模型 |

#### MindIE

| 项目 | 详情 |
| :--- | :--- |
| **定位** | 华为自研推理引擎，原生支持昇腾 |
| **状态** | 生产级，面向政企和高合规场景 |
| **注意** | MindIE Turbo 已并入 vLLM-Ascend，无需单独安装；MindIE-SD 仍用于扩散模型 |

### 4.4 Hugging Face 生态

| 组件 | Ascend 支持状态 | 说明 |
| :--- | :--- | :--- |
| **transformers** | ✅ 通过 `torch_npu` 自动适配（≥ 4.32.0） | 无需特殊补丁，NPU 作为 PyTorch backend 运行 |
| **accelerate** | ✅ 通过 `torch_npu` 适配（≥ 0.22.0） | BF16、FSDP、DeepSpeed 集成可用 |
| **peft** | ✅ 可用（≥ 0.5.0） | LoRA/Prefix Tuning 等可用 |
| **trl** | ✅ 可用（≥ 0.5.0） | 与 vLLM-Ascend 配合可在 910B 上运行 GRPO 等 RL 训练 |
| **DeepSpeed** | ✅ 通过 `torch_npu` 适配支持 | Atlas 800T A2 及更新平台无需额外 `deepspeed_npu` 插件 |

**注意**：Hugging Face 路径提供的是 GPU 等价能力，但缺乏 Ascend 专属 kernel 优化。若追求极限性能，仍需使用 MindSpeed-LLM、vLLM-Ascend 等原生优化栈。

### 4.5 选型速查表

| 需求 | 推荐框架（Ascend） | 备注 |
| :--- | :--- | :--- |
| 快速 SFT/LoRA 微调 | LLaMA-Factory、ms-swift | 易用、社区活跃、文档完善 |
| 大规模预训练 / 全参数训练 | MindSpeed-LLM、Megatron-LM + torch_npu | 华为官方优化，并行策略最全 |
| RLHF / GRPO / PPO | MindSpeed RL、verl、ms-swift | MindSpeed RL 性能最强；verl 生态最灵活 |
| OpenRLHF 用户迁移 | 社区 OpenRLHF-NPU fork | 迁移成本最低，但功能有限制 |
| 智谱 GLM 系列后训练 | slime-ascend | 与 SGLang 集成 |
| 高吞吐在线推理 | vLLM-Ascend | 事实标准，模型覆盖最广 |
| 结构化生成 / 复杂前端 | SGLang（NPU 适配中） | 2026 年 Q2 功能快速补齐 |
| 政企合规推理 | MindIE | 华为自研，原生支持 |
| Hugging Face 用户快速落地 | transformers + accelerate + trl | 零迁移成本，性能需二次优化 |

---

## 五、关键融合算子与加速库

融合算子是大模型性能的核心。以下按 Attention、MoE 通信、通用融合算子、开发工具四个方向，对比 GPU 与 Ascend 生态。

### 5.1 FlashAttention / MLA

#### GPU 生态

| 算子/项目 | 组织 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| **FlashAttention** | Tri Dao / Stanford | ✅ 成熟 | FlashAttention-2/3，Hopper/Blackwell 深度优化 |
| **FlashMLA** | DeepSeek | ✅ 2025 发布 | DeepSeek MLA 官方 GPU kernel，利用率 67.4% |
| **FlashInfer** | FlashInfer Team | ✅ 活跃 | 支持多种 Attention 变体、PageAttention、KV Cache 量化 |
| **xFormers** | Meta | ✅ 成熟 | 综合 Attention/优化库 |
| **cuDNN Attention** | NVIDIA | ✅ 成熟 | 官方 fused attention，与 Transformer Engine 集成 |

#### Ascend 生态

| 算子/项目 | 组织 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| **Ascend FlashAttention** | 华为 | ✅ 可用 | CANN 内置，vLLM-Ascend/SGLang 调用 |
| **AMLA** | 学术界/华为 | ✅ 2025 论文 | 面向 DeepSeek MLA 的 Ascend 优化 kernel，利用率 **86.8%**，超过 FlashMLA |
| **FastAttention** | Huawei Noah's Ark | ✅ 2024 | 首个 FlashAttention2 Ascend 适配，算子级提速 10.7× |
| **DFlash Attention** | vLLM-Ascend | ✅ v0.19.1rc1 | FULL_DECODE_ONLY 优化 |
| **`_npu_flash_attention_unpad`** | vLLM-Ascend | ✅ | A2/A3 注意力算子升级，替代 `npu_fusion_attention` |
| **FusedAttention (FA)** | CloudMatrix-Infer | ✅ | 融合 FlashAttention 与相邻数据 reshape |
| **MLAProlog** | CloudMatrix-Infer | ✅ | 融合 RMSNorm、linear projection 等 Attention 前处理 |
| **Sparse FlashAttention** | TileLang-Ascend | ✅ 2026.03 | 稀疏注意力 Ascend 实现 |

**关键差异**：GPU 侧 FlashAttention-3 与 cuDNN Attention 最为成熟；Ascend 侧 FlashAttention 已可用，MLA 优化通过 AMLA 和 CloudMatrix-Infer 融合算子快速追赶，但 FlashAttention-3 级特性仍在补齐。

### 5.2 DeepEP / MoE 通信优化

#### GPU 生态

| 项目 | 组织 | 说明 |
| :--- | :--- | :--- |
| **DeepEP** | DeepSeek | MoE 专家并行 all-to-all 通信库，低延迟模式支持 sub-150μs，Normal 模式支持大 batch |
| **DeepSeek-V3 EP** | DeepSeek | 生产级 MoE EP 实现 |
| **Megatron-LM MoE** | NVIDIA | EP + TP 组合优化 |
| **Tutel** | Microsoft | 早期 MoE 优化库 |

#### Ascend 生态

| 项目 | 组织 | 说明 |
| :--- | :--- | :--- |
| **DeepEP-Ascend** | 华为昇腾生态团队 | 昇腾原生 EP 通信后端，兼容 DeepEP API；低延迟模式已支持 DeepSeek-V3 推理，sub-150μs |
| **ascend_fuseep** | SGLang NPU | 昇腾原生融合算子，用于 decode-only 量化模型 |
| **Fused W4A8 Kernel** | vLLM-Ascend | 融合 W4A8 dispatch + FFN + combine |
| **DispatchFFNCombine** | vLLM-Ascend | MoE 专家并行自定义算子 |
| **MC2 dispatch/combine** | vLLM-Ascend | MXFP4/MXFP8 量化下的 MoE 调度归并 |
| **EPLB** | MindSpeed-LLM / vLLM-Ascend | Expert Parallelism Load Balance，专家负载均衡 |

**关键差异**：DeepEP 是 GPU 上 MoE EP 的标杆实现；Ascend 侧通过 DeepEP-Ascend 移植和 HCCL 原生优化实现功能兼容，但在部分场景（如 SGLang MoE）仍比 vLLM-Ascend 原生 HCCL all-to-all 慢约 23%，持续优化中。

### 5.3 其他关键融合算子

| 算子 | GPU 生态 | Ascend 生态 |
| :--- | :--- | :--- |
| **Fused RMSNorm** | Triton/CUDA kernel 广泛可用 | NpuFusedRMSNorm、MindSpeed RL 融合算子 |
| **Fused RoPE** | CUDA kernel | NpuFusedRoPE |
| **Fused SwiGLU** | CUDA kernel | NpuFusedSwiGlu |
| **Fused MoE** | NVIDIA MoE fused kernel | NpuFusedMoE |
| **Fused Matmul + AllReduce + Add + RMSNorm** | 部分框架支持 | vLLM-Ascend npugraph_ex 已集成 `MatmulAllReduceAddRMSNorm` |
| **GMM (Grouped MatMul)** | CUTLASS/Triton | MindSpeed RL 融合算子 |
| **KV Cache Quantization** | INT8/FP8 KV Cache | C8 INT8 KV Cache（GQA 模型）、FP8 KV Cache（950 系列原生支持） |
| **Liger-Kernel** | GPU 生态广泛支持 | ❌ 暂不支持 NPU |

### 5.4 算子开发工具

| 工具 | GPU 生态 | Ascend 生态 |
| :--- | :--- | :--- |
| **底层语言** | CUDA C++ | Ascend C |
| **DSL/Tiling 工具** | Triton、CUTLASS | TBE、Ascend-Triton |
| **编译/IR 工具** | nvcc、MLIR NVGPU | CANN 编译器、MindIR |
| **新兴 DSL** | TileLang | **TileLang-Ascend**（2026 年发布 FlashAttention、DeepSeek-V4 kernel） |
| **自动调优** | nvFuser、Triton autotune | AOE（Ascend Optimization Engine） |
| **性能分析** | Nsight Compute | MindStudio Insight Profiler |

**结论**：Ascend 在 FlashAttention、MoE EP、MLA 等关键算子上已从"可用"走向"好用"，DeepEP-Ascend、AMLA、TileLang-Ascend 是 2025-2026 年的关键里程碑。但与 NVIDIA 相比，第三方社区贡献的算子丰富度、Liger-Kernel 等新兴工具支持仍有差距。

---

## 六、其他竞争者（简要）

| 厂商 | 产品 | 训练状态 | 推理状态 |
| :--- | :--- | :--- | :--- |
| **AMD** | Instinct MI300X / MI350 | ROCm + PyTorch 可用，软件成熟度追赶 CUDA | vLLM/ROCm 支持逐步完善 |
| **Intel** | Gaudi2 / Gaudi3 | PyTorch-Habana 可用，生态较弱 | 性价比高，特定客户采用 |
| **国内其他** | 寒武纪思元、海光 DCU、天数智芯、燧原 | 部分支持 PyTorch，集群规模有限 | 各有限定场景，生态差距明显 |

目前大模型训推芯片格局：**NVIDIA 全球领先 → 昇腾国内主力 → AMD/Intel 作为第二供应商**。

---

## 七、趋势判断

1. **训练端**：NVIDIA 仍是绝对主流，但昇腾通过 MindSpeed-LLM + 超节点 + 国产化政策，在政企、金融、电信等 closed market 快速渗透。
2. **推理端**：昇腾与 NVIDIA 差距最小，vLLM-Ascend 让开发者可用同一套接口服务，迁移成本低。
3. **社区生态快速补齐**：LLaMA-Factory、ms-swift、verl、SGLang、slime-ascend 等主流社区框架在 2024-2026 年密集适配 Ascend，开发者可选择面显著扩大。
4. **关键算子快速追赶**：DeepEP-Ascend、AMLA、TileLang-Ascend 等标志着 Ascend 在 FlashAttention、MoE、MLA 等核心算子上从可用走向好用。
5. **软件栈收敛**：
   - GPU：PyTorch + vLLM/TensorRT-LLM + NCCL 仍是事实标准。
   - Ascend：PyTorch(torch_npu) + vLLM-Ascend + MindSpeed-LLM + CANN/HCCL 成为主路径，MindSpore 主要服务原生/政企场景。
6. **量化/压缩**：FP4、FP8、INT8、MoE 稀疏推理成为两阵营共同重点。
7. **集群架构**：从"单卡性能竞赛"转向"机架级/超节点级系统设计"，互联、散热、供电成为新瓶颈。
8. **开源 vs 闭源**：NVIDIA CUDA 闭源但成熟；华为 CANN 开源试图复制 CUDA 成功路径，缩短生态差距。

---

## 八、结论

- **如果追求极致性能、最新算法最快落地、全球化部署**：NVIDIA GPU 生态仍是唯一选择。
- **如果看重国产化、政策合规、供应链安全、成本可控**：Ascend 生态在 2025-2026 年已进入"好用"阶段，尤其在推理侧值得投入。
- **对于开发者**：掌握 PyTorch + vLLM 即可同时覆盖 GPU 和 Ascend 两套硬件；Ascend 特有技能集中在 CANN/MindSpeed/HCCL 调优。
- **对于社区框架用户**：
  - 微调优先选 **LLaMA-Factory** 或 **ms-swift**；
  - RLHF/Post-Training 优先选 **MindSpeed RL** 或 **verl**；
  - 推理优先选 **vLLM-Ascend**；
  - Hugging Face 用户可直接用 **transformers + accelerate + trl** 快速落地，再按需切换到原生优化栈。
- **对于算子优化**：
  - Attention 优先用 **Ascend FlashAttention / AMLA / DFlash**；
  - MoE 通信优先用 **DeepEP-Ascend / ascend_fuseep / MC2**；
  - 自定义 kernel 可用 **Ascend C / TBE / TileLang-Ascend**。
- **对于本项目**：仓库中的 `vllm-ascend` skill 与当前生态趋势一致，建议以 vLLM-Ascend 作为昇腾推理的标准入口，MindSpeed-LLM 作为训练入口。

---

## 九、TCO 与成本效益分析

### 9.1 硬件采购成本对比

下表为 2025–2026 年主流训练/推理芯片的市场参考价。昇腾价格受渠道、批量、配套服务影响较大，且官方不公开零售价，以下区间综合自供应链、云租赁平台及行业研报。

| 芯片 | 定位 | 单卡市场价（万元 RMB） | 备注 |
| :--- | :--- | :--- | :--- |
| **NVIDIA H100 SXM5** | 训练旗舰 | 22–30 | 官方约 $25k–$30k；受出口管制，国内实际采购可能显著溢价 |
| **NVIDIA H200 SXM5** | 训练/推理 | 30–40 | 141GB 显存，长上下文溢价 |
| **NVIDIA B200 SXM6** | 训练/推理 | 40–55 | 192GB 显存，FP4 推理 |
| **昇腾 910B** | 训练 | 5–12 | 2025 年主力，逐步减产 |
| **昇腾 910C** | 训练/推理 | 11–20 | 双晶粒封装，128GB HBM，价格受 HBM 成本波动 |
| **昇腾 950PR** | 推理/预填充 | 7–7.5 | 2026 Q1 商用，128GB HBM，推理主力 |
| **昇腾 950DT** | 训练/解码 | 8–15 | 2026 Q4 上市，144GB HBM；早期预估差异大，实际以官方/代理商报价为准 |

> 注：华为芯片通常以整机柜或服务器形式销售，单卡价为反推估算。实际采购需通过华为或授权代理商询价。

### 9.2 云端租赁成本对比

以 **8 卡服务器每小时租赁价** 为统一口径（2026 年主流云厂商/算力平台公开报价）：

| 平台/硬件 | 配置 | 每小时价格 | 备注 |
| :--- | :--- | :--- | :--- |
| **Spheron H100 spot** | 8×H100 SXM5 | ~$8.24（≈¥59） | 竞价实例，最便宜 |
| **Lambda Labs H100** | 8×H100 SXM | ~$20–28（≈¥144–200） | 稳定按需 |
| **AWS P5 / GCP A3** | 8×H100 | ~$55–88（≈¥396–633） | 超大规模云，含 SLA |
| **昇腾 910B（算力云）** | 8×910B | ¥20–45 | 第三方算力平台 |
| **昇腾 910B（AutoDL）** | 1×910B | ¥3.68/小时 | 按月/年折扣 |
| **华为云 ModelArts** | 昇腾训练实例 | 按需/包年包月 | 无公开按小时价，需询价 |

**关键观察**：
- 海外 neo-cloud 的 H100 spot 价格已大幅下降（2023 年峰值约 $8/GPU·hr，2026 年约 $1–3/GPU·hr）。
- 昇腾 910B 租赁价与海外 neo-cloud H100 接近，但显著低于 AWS/GCP/Azure 等超大规模云。
- 若工作负载可容忍中断，H100 spot 仍具成本优势；若需国产化合规，昇腾是主要选项。

### 9.3 训练成本估算

以 **Llama3-70B Dense 模型预训练 1T tokens** 为例，估算不同平台的总训练成本（仅算力）：

| 平台 | 集群规模 | 单卡有效吞吐 | 训练时长 | 租赁总成本（估算） |
| :--- | :--- | :--- | :--- | :--- |
| **H100 SXM5** | 1024 卡 | ~250 tokens/s/GPU | ~46 天 | ~$1.1M（spot）/ ~$2.8M（neo-cloud 按需）/ ~$7.6M（AWS/GCP） |
| **昇腾 910B** | 1024 卡 | ~150 tokens/s/GPU | ~77 天 | ~¥470–710 万 |
| **昇腾 910C** | 1024 卡 | ~300 tokens/s/GPU | ~38 天 | ~¥350–550 万 |

> 注：成本为仅算力部分的粗略估算，受并行策略、序列长度、MFU、实际租赁价/补贴影响较大。H100 spot 按 $1.03/GPU·hr、按需按 $2.5/GPU·hr、AWS 按 $6.88/GPU·hr 估算；昇腾按 ¥2.5–3.75/GPU·hr 估算。

### 9.4 推理成本估算

以 **DeepSeek-V3/R1 671B MoE** 推理为例，估算每百万 token 成本：

| 平台 | 部署形态 | 输入 $/M tokens | 输出 $/M tokens | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **H100 集群** | 8×H100 + vLLM | 参考市场价 | 参考市场价 | 满血版部署成本高 |
| **昇腾 910B 集群** | 8×910B + vLLM-Ascend | 低于 H100 20–40% | 低于 H100 20–40% | 国产算力补贴后更优 |
| **昇腾 950PR/DT 集群** | 超节点 + vLLM-Ascend | 预计进一步下降 | 预计进一步下降 | 2026 年 H2 规模化 |

华为公开披露：CloudMatrix 384 超节点部署 DeepSeek-R1，在 50ms 时延约束下可达 **1,920 tokens/s/卡** 的 decode 吞吐，能效比与成本显著优于传统 H100 机群。

### 9.5 TCO 结论

| 场景 | 推荐平台 | 理由 |
| :--- | :--- | :--- |
| **极致成本敏感 + 可中断训练** | H100 spot / B200 spot | 当前云租赁价最低 |
| **国产化合规 + 本地化部署** | 昇腾 910B/C / 950 系列 | 硬件采购价低，无出口管制风险 |
| **长上下文训练/推理** | H200 / 950DT | 显存容量决定可服务规模 |
| **大规模 MoE 推理** | CloudMatrix 384 / GB200 NVL72 | 超节点互联降低通信成本 |

---

## 十、版本兼容矩阵

昇腾软件栈版本严格耦合，**CANN / PyTorch / torch_npu / vLLM-Ascend / MindSpeed** 必须匹配使用。以下矩阵基于 2026 年主流发布版本整理。

### 10.1 训练栈推荐组合

| 用途 | CANN | PyTorch | torch_npu | MindSpeed-LLM | Python | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **主流训练** | 8.5.1 | 2.7.1 | 2.7.1.post2 | core_r0.16.0 | 3.10/3.11 | 当前最稳定组合 |
| **新特性训练** | 9.0.0 | 2.9.0 | 2.9.0.post2 | core_r0.16.0+ | 3.10/3.11 | 支持 FP8/新模型 |
| **verl RL 训练** | 9.0.0 | 2.9.0 | 2.9.0.post2 | core_r0.16.0 | 3.10/3.11 | verl 官方验证栈 |

### 10.2 推理栈推荐组合

| 用途 | CANN | PyTorch | torch_npu | vLLM-Ascend | triton-ascend | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **稳定推理** | 8.5.1 | 2.9.0 | 2.9.0.post1+git4c901a4 | 0.18.0 | 3.2.0.dev20260322 | 官方推荐稳定版 |
| **A3/A5 新硬件** | 9.0.0 | 2.9.0 | 2.9.0.post2 | 0.18.0/0.19.1 | 3.2.1 | 支持 310P、Qwen3-Omni |
| **生产 K8s** | 9.0.0 | 2.10.0 | 2.10.0 | 0.20.2rc1 | 配套版本 | MindIE Service 推荐 |

### 10.3 社区框架版本要求

| 框架 | 最低 CANN | 推荐 torch_npu | 推荐 vLLM-Ascend | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **LLaMA-Factory** | 8.0.RC1+ | 2.5.1+ | - | NPU-A2/A3 Docker 镜像可用 |
| **ms-swift** | 8.5.1 | 2.7.1+ | 0.18.0+ | 自动 NPU patch |
| **verl** | 8.3.RC1+ | 2.8.0+ | 0.18.0 | RL 训练 |
| **SGLang** | 8.5.0 | 2.8.0 | - | 2026 Q1 目标 |
| **OpenRLHF-NPU** | 8.0.RC3/8.1.RC1 | 2.5.1 | 0.7.3 | 社区维护版 |

### 10.4 版本锁定注意事项

1. **torch_npu 2.9.0.post1** 无法通过默认 pip 安装，需从华为 OBS 仓库手动下载 whl。
2. **vLLM 与 vLLM-Ascend 版本必须严格一致**（如 0.18.0 + 0.18.0）。
3. CANN 升级通常需要同步升级驱动、固件、toolkit、nnal、kernels 五个包。
4. Python 3.12 支持仍在逐步完善，生产环境建议 3.10 或 3.11。

---

## 十一、CUDA 到 Ascend 迁移路径与成本

### 11.1 迁移方法

| 方法 | 工作量 | 适用场景 | 关键操作 |
| :--- | :--- | :--- | :--- |
| **自动迁移（transfer_to_npu）** | 低 | 标准 PyTorch 模型，无 custom CUDA kernel | `from torch_npu.contrib import transfer_to_npu` 一行注入 |
| **脚本转换工具** | 中 | 训练脚本批量替换 CUDA 调用 | 使用 `pytorch_gpu2npu.sh` 自动转换 |
| **手动迁移** | 高 | 含 custom kernel、复杂并行、性能敏感场景 | 替换 `torch.cuda`→`torch.npu`、`nccl`→`hccl`、重写 kernel |

### 11.2 常见不兼容项

| CUDA 侧 | Ascend 侧 | 处理建议 |
| :--- | :--- | :--- |
| `torch.cuda` | `torch.npu` | 全局替换，注意 `non_blocking` 行为差异 |
| `nccl` backend | `hccl` backend | DDP/FSDP backend 字符串替换 |
| Custom CUDA kernel | 需用 Ascend C / TBE 重写 | 性能敏感算子必须重写 |
| `flash-attn` | `npu_fusion_attention` / Ascend FlashAttention | 框架通常自动 fallback |
| `torch.compile` | 条件跳过 / `torchair` | NPU 支持仍在完善 |
| `bitsandbytes` / QLoRA | 昇腾原生 INT8/FP8 量化 | QLoRA 支持有限 |
| `triton` CUDA kernel | `triton-ascend` | 部分支持，需验证 |
| `xformers` | 标准 PyTorch Attention | 自动降级，性能可能下降 |

### 11.3 迁移成本估算

| 项目类型 | 预计周期 | 人力投入 | 主要风险 |
| :--- | :--- | :--- | :--- |
| **简单 PyTorch 模型** | 1–2 周 | 1 人 | 少量 API 替换 |
| **标准 LLM 训练脚本** | 1–2 个月 | 2–3 人 | 并行策略、通信优化 |
| **含 custom kernel 的模型** | 2–4 个月 | 3–5 人 | 算子重写、精度对齐 |
| **生产级推理服务** | 1–3 个月 | 2–4 人 | 延迟/吞吐调优、K8s 部署 |

### 11.4 迁移工具链

- **脚本转换**：`pytorch_gpu2npu.sh`（CANN toolkit 自带）
- **精度调试**：MindStudio Insight Profiler、CANN Profiler
- **算子分析**：AOE（Ascend Optimization Engine）自动调优
- **模型转换**：ATC（Ascend Tensor Compiler）、AOE 图优化

---

## 十二、实测性能基准

### 12.1 训练性能参考

| 模型 | 平台 | 配置 | MFU | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **Llama3-70B** | H100 SXM5 | TP=8/PP=4 | 45–55% | Megatron-LM 优化；具体吞吐受并行策略/序列长度影响 |
| **Llama3-70B** | 昇腾 910B | TP=8/PP=4 | 30–40% | MindSpeed-LLM；约为 H100 的 60–70% 效率 |
| **Llama3-70B** | 昇腾 910C | TP=8/PP=4 | 40–50% | 接近 H100 水平 |
| **DeepSeek-V3 671B** | H800 | EP+TP+PP | ~42% | DeepSeek 官方报告 |
| **盘古 Ultra MoE 718B** | 昇腾 910C | 万卡集群 | 41% | 华为官方，万卡级 MoE |
| **盘古 Ultra 135B** | 昇腾 910B | 8192 卡 | 50% | 纯昇腾稠密模型 |

> 注：MFU 为模型浮点运算利用率，是大规模训练效率的核心指标；单卡 tokens/s 与序列长度、并行策略强相关，上表不列具体吞吐数值以避免误导。

### 12.2 推理性能参考

以 **DeepSeek-R1 671B MoE** 为例：

| 平台 | 精度 | TTFT | 50ms 约束下单卡 decode 吞吐 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **H100 SXM5** | BF16/FP8 | ~45 ms | 参考基准 | vLLM/TensorRT-LLM |
| **昇腾 910B** | BF16/INT8 | ~52 ms | 1,920 tokens/s | 潞晨优化方案 |
| **昇腾 910B（第三方实测）** | BF16 | 73–399 ms | 1.5–9.2 tokens/s/并发 | 并发提升后吞吐下降明显 |
| **CloudMatrix 384** | BF16/INT8 | - | 接近 H100 集群 | 超节点互联优势 |

> 注：推理吞吐受 batch size、并发数、序列长度、量化精度、EP/TP 配置影响极大；1,920 tokens/s 为特定优化方案（潞晨/华为披露）的峰值数据，第三方实测在低并发下显著更低。

以 **Mistral-7B** 在昇腾 910B 上优化为例：

| 优化阶段 | 延迟 | 吞吐 | 提升 |
| :--- | :--- | :--- | :--- |
| 基线 FP16 | 6,582 ms | 18.2 tokens/s | 1× |
| INT8 量化 | ~867 ms | 138.4 tokens/s | 7.6× |
| 连续批处理 | 进一步降低 | 接近线性扩展 | - |

### 12.3 关键发现

1. **训练侧**：单卡 H100 仍领先 910B 约 50–70%；910C 已接近 H100 水平；集群 MFU 与软件优化强相关。
2. **推理侧**：910B 经 CANN/vLLM-Ascend 深度优化后，与 H100 差距可缩小至 5–15%，能效比更优。
3. **长上下文**：H200/950DT 因显存容量优势，在 128K+ 场景下优势明显。
4. **MoE 模型**：超节点架构（CloudMatrix 384 / GB200 NVL72）对 MoE All-to-All 通信至关重要。

---

## 十三、多模态与 Agent 生态

### 13.1 多模态训练框架

| 框架 | 定位 | Ascend 支持 | 代表模型 |
| :--- | :--- | :--- | :--- |
| **MindSpeed-MM** | 华为官方多模态大模型套件 | ✅ 原生 | Qwen2VL、InternVL2、CogVideoX、FLUX、SD3.5 |
| **ms-swift** | 阿里一站式训练/推理框架 | ✅ 完整 | 100+ MLLM（Qwen-VL、InternVL、LLaVA 等） |
| **LLaMA-Factory** | 统一微调框架 | ✅ 部分 | LLaVA、Qwen-VL 等 |

**MindSpeed-MM 关键特性**：
- 支持多模态生成（文生图、文生视频、图生视频）与多模态理解
- 支持 TP/PP/CP/DSP/分布式优化器/重计算
- 内置 Profiling 与 MindStudio Insight 性能分析

### 13.2 多模态推理

| 模型 | Ascend 推理引擎 | 状态 | 备注 |
| :--- | :--- | :--- | :--- |
| **Qwen2.5-VL** | vLLM-Ascend | ✅ 已支持 | 华为云 ModelArts 最佳实践 |
| **InternVL2.5/3.0** | vLLM-Ascend | ✅ 已支持 | Eager/ACLGraph 模式 |
| **GLM-Image** | MindIE / vLLM-Ascend | ✅ 已支持 | 首个国产芯片全程训练的多模态 SOTA |
| **Qwen3-Omni** | vLLM-Ascend | ✅ CANN 9.0 | 多模态统一模型 |

### 13.3 Agent 框架

| 框架 | 厂商 | Ascend 支持 | 说明 |
| :--- | :--- | :--- | :--- |
| **AutoGLM** | 智谱 | ⚠️ 推理可部署 | 可基于昇腾推理服务部署，训练多在 GPU |
| **ms-swift Agent** | 阿里 | ✅ 支持 | 与 Qwen/Qwen-VL 配合，可在昇腾上训练/推理 |
| **OpenManus / MetaGPT** | 社区 | ⚠️ 依赖 LLM API | 可调用昇腾部署的模型服务 |
| **MindSpeed-RL + vLLM-Ascend** | 华为 | ✅ 支持 | 面向 Agent/RL 的后训练与推理一体化方案 |

**Agent 场景关键需求**：
- 长上下文（128K–1M tokens）：昇腾 950DT/CloudMatrix 384 有优势
- 工具调用/结构化生成：SGLang 在昇腾上的结构化输出仍在完善
- 多模态感知：Qwen2.5-VL + InternVL 已可在昇腾上端到端运行

---

## 十四、集群网络与互联拓扑

### 14.1 Scale-Up（卡间互联）

| 技术 | 厂商 | 单卡带宽 | 拓扑 | 延迟 |
| :--- | :--- | :--- | :--- | :--- |
| **NVLink 4 + NVSwitch** | NVIDIA | 900 GB/s | 交换拓扑 | << 1 μs |
| **NVLink 5 + NVSwitch** | NVIDIA | 1.8 TB/s | 交换拓扑 | << 1 μs |
| **HCCS** | 华为 | ~392 GB/s | 总线/交换混合 | ~1 μs |
| **MatrixLink（光互联）** | 华为 | ~784 Gbps / 2.8 Tbps（不同统计口径） | 全对等 All-to-All | << 1 μs |

### 14.2 Scale-Out（网络扩展）

| 技术 | 厂商 | 单卡带宽 | 协议 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| **InfiniBand NDR** | NVIDIA/Mellanox | 400 Gb/s | RDMA | 超大规模训练 |
| **RoCEv2** | 多厂商 | 200–400 Gb/s | RDMA over Ethernet | 成本敏感场景 |
| **华为自研 RDMA / 灵衢** | 华为 | 400 Gb/s+ | 自研 RDMA | CloudMatrix 超节点间扩展 |

### 14.3 超节点拓扑对比

| 指标 | **NVIDIA GB200 NVL72** | **华为 CloudMatrix 384** |
| :--- | :--- | :--- |
| 单节点 GPU/NPU 数 | 72 | 384 |
| 互联介质 | NVLink 5 铜缆 | MatrixLink 光纤 |
| 内存容量 | ~30 TB 统一显存 | 48 TB HBM + 49.2 TB 共享内存池 |
| BF16 算力 | ~180 PFLOPS | 300 PFLOPS |
| 总互联带宽 | ~130 TB/s | 269 TB/s |
| 扩展规模 | 576 卡（NVL576） | 官方宣称可扩展至数万卡；部分第三方对比表称最大 16 万卡 |
| 能效 | 更优 | 每 FLOP 功耗高约 2.5× |
| 设计哲学 | GPU 中心化机架 | 全对等超级服务器 |

### 14.4 对 MoE 训练的影响

- **MoE All-to-All 通信** 对 Scale-Up 带宽极度敏感。
- CloudMatrix 384 的全对等光互联可将 MoE 训练效率损失控制在较低水平，盘古 Ultra MoE 万卡 MFU 达 41%。
- GB200 NVL72 在 72 卡域内提供最高带宽，跨域扩展依赖 IB/RoCE。

---

## 十五、推理部署工程实践

### 15.1 Kubernetes 部署方案

| 方案 | 组件 | 适用场景 | 关键步骤 |
| :--- | :--- | :--- | :--- |
| **vLLM-Ascend + K8s** | vLLM-Ascend、Ray/HCCL | 通用在线推理 | 节点打标签 `accelerator=huawei-Ascend910`、配置 NPU 资源、部署 Service |
| **MindIE Service + K8s** | MindIE MS、Deployer | 政企生产环境 | 官方 Helm/Deployment、RBAC 配置、日志/数据持久化 |
| **SGLang + K8s** | SGLang、HCCL | 结构化生成/复杂前端 | 2026 年 Q2 持续完善 K8s/LWS/RBG 支持 |

**关键环境变量（vLLM-Ascend 生产调优）**：

| 变量 | 作用 | 推荐值 |
| :--- | :--- | :--- |
| `VLLM_ASCEND_ENABLE_MATMUL_ALLREDUCE=1` | 融合 MatMul + AllReduce | 1 |
| `VLLM_ASCEND_ENABLE_FLASHCOMM=1` | NPU 间通信优化 | 1 |
| `VLLM_ASCEND_ENABLE_TOPK_TOPP_OPTIMIZATION=0` | 采样优化（异常时关闭） | 0 |

> 注：vLLM-Ascend 0.20.2+ 起，上述环境变量逐步弃用，建议迁移到 `--additional-config` 配置项（如 `enable_matmul_allreduce`、`enable_flashcomm1`）。

### 15.2 PD 分离（Prefill-Decode Disaggregation）

| 方案 | 状态 | 关键配置 |
| :--- | :--- | :--- |
| **vLLM-Ascend PD 分离** | ✅ 支持 | `--disaggregation-mode prefill/decode`、KV transfer 配置 |
| **MindIE 原生前后端分离** | ✅ 支持 | MindIE-Service 配置 |
| **SGLang PD 分离** | 🚧 2026 Q2 重点 | `--disaggregation-mode decode`、Mooncake NPU |

**实践经验**：
- PD 分离可显著降低 decode 时延，但增加 KV Cache 传输开销。
- 在 CloudMatrix 384 / 高带宽 Scale-Up 环境下，KV transfer 瓶颈较小。
- 配置 `dp` 与 `tp` 时需注意一致性，避免 `Expected 1, but got 2` 类报错。

### 15.3 KV Cache 量化

| 量化方案 | 精度 | 显存节省 | 适用模型 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| **C8 INT8 KV Cache** | INT8 | ~50% | GQA 模型 | vLLM-Ascend 已支持 |
| **FP8 KV Cache** | FP8 | ~50% | 950PR/DT 等原生 FP8 硬件 | 950 系列原生支持 |
| **FP4 KV Cache** | FP4 | ~75% | 950PR/DT | 2026 年逐步支持 |

**注意事项**：KV Cache 量化对长上下文和 MoE 模型收益最大，但需验证精度退化。

### 15.4 生产部署 checklist

- [ ] 确认 CANN/驱动/固件版本与 vLLM-Ascend 匹配
- [ ] NPU 节点标签与资源配额正确配置
- [ ] 模型权重格式与量化配置一致
- [ ] 预热测试：连续批处理、高并发、长序列
- [ ] 监控：NPU 利用率、HBM 占用、通信带宽、请求 P99 延迟
- [ ] 故障演练：单卡故障、节点故障、服务滚动升级

---

## 十六、故障恢复与长稳训练

### 16.1 断点续训（Checkpoint Resume）

| 组件 | 能力 | 说明 |
| :--- | :--- | :--- |
| **MindSpeed-LLM** | ✅ 原生支持 | 定期保存模型权重、优化器状态、训练迭代数 |
| **ModelArts** | ✅ 断点续训 + 故障快恢 | 支持 LoRA 除外 |
| **MindCluster** | ✅ 自动检测 + 重调度 | 节点/Pod 级故障恢复 |

**Checkpoint 文件结构示例**：
```
saved_checkpoints/
├── iter_0000010/
├── iter_0000020/
└── latest_checkpointed_iteration.txt  # 需与 iter_xxxx 编号一致
```

### 16.2 故障快恢（Fault Fast Recovery）

华为 MindCluster 提供两种恢复模式：

| 模式 | 适用故障 | 恢复方式 | 优势 |
| :--- | :--- | :--- | :--- |
| **优雅容错模式** | 部分 NPU 芯片故障 | 退出该芯片训练进程 + 热复位，无需重调度 | 避免任务 Pending |
| **重调度模式** | 节点故障、网络故障 | 删除 Pod，重新调度到健康节点 | 通用兜底 |

### 16.3 异步 Checkpoint

| 技术 | 作用 | 代表实现 |
| :--- | :--- | :--- |
| **异步分布式 Checkpoint** | 隐藏持久化延迟，减少训练中断 | MindSpeed-LLM + MindCluster |
| **LowDiff / FlashRecovery** | 差分 checkpoint、无 checkpoint 快速恢复 | 学术前沿（arXiv 2025） |

### 16.4 长稳训练最佳实践

来自 USENIX ATC'25 华为 18,000 卡集群优化经验：

| 问题 | 根因 | 优化措施 | 效果 |
| :--- | :--- | :--- | :--- |
| 吞吐波动大 | 远程存储日志、网络链路故障、NPU 内存故障 | 日志切本地、修复 spine-leaf 链路、隔离 30 个异常节点 | 方差从 291 降至 31，平均吞吐提升 1.19× |
| step time 过长 | `tensor.item()` 频繁 CPU-NPU 同步 | 消除同步操作 | step time 54.82 ms |
| CPU 瓶颈 | dataloader 与训练进程绑定同一核心 | CPU 进程解绑 | 8-NPU 训练 1.91× 加速 |

**长稳训练 checklist**：
- [ ] 开启周期性 checkpoint（建议每 100–1000 step）
- [ ] 配置 MindCluster 优雅容错 + 重调度双保险
- [ ] 监控 NPU 健康状态、网络链路、节点心跳
- [ ] 本地存储日志，避免远程存储成为瓶颈
- [ ] 预跑 burn-in 测试，识别异常节点并隔离
- [ ] 训练前验证 checkpoint 可正确加载

---

## 十七、参考来源

- [昇思 MindSpore 官网](https://www.mindspore.cn/)
- [vLLM-Ascend Release Notes](https://docs.vllm.ai/projects/ascend/en/main/user_guide/release_notes.html)
- [华为云 Ascend-vLLM 最佳实践](https://support.huaweicloud.com/intl/en-us/bestpractice-modelarts/modelarts_llm_infer_5906001.html)
- [H100 vs H200 vs B200: Best NVIDIA GPU for AI Infrastructure 2026](https://www.nextpcb.com/blog/h100-vs-h200-vs-b200-nvidia-gpu-comparison)
- [NCCL Tuning for Multi-GPU LLM Training 2026](https://www.spheron.network/blog/nccl-tuning-multi-gpu-llm-training-2026/)
- [Groundbreaking SuperPoD Interconnect — 华为超节点](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)
- [Accelerating Model Training on Ascend Chips — USENIX ATC'25](https://www.usenix.org/system/files/atc25-zhou.pdf)
- [AMD Instinct MI300/MI350 Workload Optimization](http://rocm.docs.amd.com/en/latest/how-to/rocm-for-ai/inference-optimization/workload.html)
- [CANN、MindSpore、MindIE、MindSpeed、MindStudio/ModelArts/ModelZoo 关系梳理](https://ai6s.net/69c0fdce54b52172bc63a6ec.html)
- [Huawei open-sources chip software ecosystem — China Daily](https://global.chinadaily.com.cn/a/202508/07/WS68940c32a3108a99c19059fd.html)
- [verl Ascend 2026Q2 Roadmap](https://github.com/verl-project/verl/issues/5526)
- [verl Ascend Install Guidance](https://verl.readthedocs.io/en/latest/ascend_tutorial/get_start/install_guidance.html)
- [verl Ascend Quickstart](https://verl.readthedocs.io/en/latest/ascend_tutorial/get_start/quick_start.html)
- [LLaMA-Factory NPU 支持文档](https://llamafactory.readthedocs.io/zh-cn/latest/multibackend/npu/npu_training.html)
- [LLaMA-Factory — vllm-ascend 用户故事](https://docs.vllm.ai/projects/ascend/en/v0.9.1/community/user_stories/llamafactory.html)
- [slime-ascend GitCode](https://gitcode.com/Ascend/slime-ascend)
- [SGLang Ascend NPU 2026 Q1 Roadmap](https://github.com/sgl-project/sglang/issues/13664)
- [SGLang Ascend NPU 2026 Q2 Roadmap](https://github.com/sgl-project/sglang/issues/25598)
- [OpenRLHF Ascend NPU RFC](https://github.com/OpenRLHF/OpenRLHF/issues/914)
- [OpenRLHF Ascend NPU Pull Request](https://github.com/OpenRLHF/OpenRLHF/pull/605)
- [MindSpeed RL arXiv 论文](https://arxiv.org/pdf/2507.19017)
- [MindSpeed RL GitHub](https://github.com/Ascend/MindSpeed-RL)
- [ms-swift NPU Support 文档](https://swift.readthedocs.io/en/latest/BestPractices/NPU-support.html)
- [TRL + vLLM-Ascend GRPO 支持](https://github.com/huggingface/trl/issues/4790)
- [Ascend Transformers Gitee](https://gitee.com/ascend/transformers)
- [Ascend DeepSpeed Gitee](https://gitee.com/ascend/DeepSpeed)
- [DeepEP-Ascend Proposal](https://github.com/deepseek-ai/DeepEP/issues/332)
- [sgl-kernel-npu GitHub](https://github.com/sgl-project/sgl-kernel-npu)
- [SGLang Expert Parallelism](https://sgl-project.github.io/advanced_features/expert_parallelism.html)
- [vLLM-Ascend DeepEP Feature Request](https://github.com/vllm-project/vllm-ascend/issues/8550)
- [vLLM-Ascend Flash Attention 文档](https://docs.vllm.ai/projects/ascend/zh-cn/main/user_guide/feature_guide/flash_attention.html)
- [AMLA arXiv 论文](https://arxiv.org/abs/2509.25224)
- [FastAttention arXiv 论文](https://arxiv.org/pdf/2410.16663v1)
- [TileLang-Ascend GitHub](https://github.com/tile-ai/tilelang-ascend)
- [Pangu Ultra MoE: How to Train Your Big MoE on Ascend NPUs — arXiv](https://arxiv.org/html/2505.04519v1)
- [华为盘古 Ultra MoE 7180 亿参数 — 机器之心](https://www.jiqizhixin.com/articles/2025-04-13-4)
- [华为盘古 Ultra 135B 纯昇腾集群训练 — IT之家](https://www.ithome.com/0/845/355.htm)
- [华为开源 7180 亿参数盘古 Ultra MoE — 搜狐](https://www.sohu.com/a/921090389_115978)
- [DeepSeek-V3 Technical Report](https://arxiv.org/html/2412.19437v1)
- [DeepSeek V4 on Huawei Ascend — Skywork AI](https://skywork.ai/skypage/en/deepseek-v4-huawei-ascend/2047581524997132288)
- [DeepSeek V4 Runs on Huawei Chips — AI for Automation](https://aiforautomation.io/news/2026-04-25-deepseek-v4-huawei-ascend-npu-inference-bill)
- [讯飞星火 V3.5 基于飞星一号全国产算力训练 — 机器之心](https://www.jiqizhixin.com/articles/2024-01-30-11)
- [讯飞星火 X2-Flash 基于昇腾 910B 集群训练 — IT之家](https://www.ithome.com/0/944/943.htm)
- [ERNIE 4.5 Technical Report](https://ernie.baidu.com/blog/publication/ERNIE_Technical_Report.pdf)
- [PaddlePaddle/ERNIE 4.5 开源 — CSDN](https://blog.csdn.net/gitblog_01312/article/details/149038469)
- [智谱 × 昇腾 × 昇思：自主创新算力赋能 — 昇腾社区](https://hwcomputing.csdn.net/697081787c1d88441d8e7c95.html)
- [智谱开源 Slime RL Scaling 框架 — CSDN](https://blog.csdn.net/zsh_1314520/article/details/160991043)
- [Qwen 系列模型基于昇腾 NPU 训练 — 华为云](https://support.huaweicloud.com/bestpractice-modelarts/modelarts_10_1505.html)
- [昇腾 NPU GRPO 训练 Qwen — 华为云开发者联盟](https://huaweicloud.csdn.net/697b339ca16c6648a985fa47.html)
- [美团 LongCat-2.0 万亿参数昇腾训练 — 36氪](https://www.36kr.com/p/3788904611033605)
- [美团 LongCat 基于国产算力训练 — Pandaily](https://pandaily.com/meituan-quietly-tests-trillion-parameter-ai-model-built-on-domestic-compute)
- [ERNIE 4.5 Technical Report — 47% MFU on H800](https://ernie.baidu.com/blog/publication/ERNIE_Technical_Report.pdf)
- [Huawei Ascend 910B Specifications — awesomeagents.ai](https://awesomeagents.ai/hardware/huawei-ascend-910b/)
- [GLM-4.5 GitHub — 355B/32B and 106B/12B MoE](https://github.com/zai-org/GLM-4.5)
- [华为 CloudMatrix 384 超节点参数 — 证券之星](https://finance.stockstar.com/IG2025061800008562.shtml)
- [华为昇腾 950/960/970 路线图 — 新浪财经](https://www.sina.cn/news/detail/5212249397397469.html)
- [DeepEP-Ascend Low-Latency Performance — sgl-kernel-npu](https://github.com/sgl-project/sgl-kernel-npu/blob/main/python/deep_ep/README_CN.md)
- [AMLA: MUL by ADD in FlashAttention Rescaling — arXiv](https://arxiv.org/abs/2509.25224)
- [H100 Cloud Pricing 2026 — GetDeploying](https://getdeploying.com/gpus/nvidia-h100)
- [GPU Cloud Pricing 2026 — Spheron](https://www.spheron.network/blog/gpu-cloud-pricing-comparison-2026/)
- [昇腾 910B 租赁价格 — 极云科技](https://www.idcsp.com/help/2568.html)
- [昇腾 910B 云主机价格 — AutoDL/算力导航](https://www.36171.com/gpu/470.html)
- [昇腾 950PR/950DT 价格与路线图 — 东方财富](https://emcreative.eastmoney.com/app_fortune/article/index.html?artCode=20260407185816041221460&postId=1690099419)
- [vLLM-Ascend v0.18.0 Release Notes](https://docs.vllm.ai/projects/ascend/en/v0.18.0/user_guide/release_notes.html)
- [verl Ascend Dockerfile Build Guidance](https://verl.readthedocs.io/en/latest/ascend_tutorial/get_start/dockerfile_build_guidance.html)
- [ms-swift NPU Support — GitHub](https://github.com/modelscope/ms-swift/blob/main/docs/source/BestPractices/NPU-support.md)
- [Ascend Model Migration Guide — Huawei](https://support.huawei.com/enterprise/en/doc/EDOC1100191782/357bb5f9/porting-the-training-script)
- [Model Migration on Ascend NPUs — Medium](https://medium.com/huawei-developers/model-migration-on-ascend-npus-a1658176d395)
- [DeepSeek 在昇腾 910B 推理实测 — 掘金](https://juejin.cn/post/7508544344414519333)
- [昇腾 NPU Mistral-7B INT8 性能调优 — 博客园](https://www.cnblogs.com/clnchanpin/p/19292231)
- [H100 Large-Scale Training Benchmarks — CoreWeave](https://www.coreweave.com/blog/nvidia-h100-gpu-benchmark-results-what-we-learned-from-large-scale-gpu-testing)
- [MindSpeed-MM Gitee](https://gitee.com/ascend/MindSpeed-MM)
- [vLLM-Ascend Supported Models](https://docs.vllm.ai/projects/ascend/en/v0.11.0/user_guide/support_matrix/supported_models.html)
- [InternVL2.5 Official Blog](https://internvl.github.io/blog/2024-12-05-InternVL-2.5/)
- [CloudMatrix 384 vs GB200 NVL72 — 今日头条](https://www.toutiao.com/article/7561227717867012646/)
- [MatrixLink Network User Guide — Huawei Cloud](https://support.huaweicloud.com/intl/zh-cn/usermanual-vpc/vpc_matrixlink_0001.html)
- [vLLM-Ascend KV Pool / Ascend Store](https://docs.vllm.ai/projects/ascend/zh-cn/main/user_guide/feature_guide/kv_pool.html)
- [MindIE Service K8s Deployment — Huawei](https://www.hiascend.com/document/detail/zh/mindie/20RC2/mindieservice/servicedev/mindie_service0030.html)
- [vLLM-Ascend PD Disaggregation Practice — CSDN](https://blog.csdn.net/a1657054242/article/details/156243060)
- [MindCluster Fault Recovery Docs — Huawei](https://www.hiascend.com/document/detail/zh/mindcluster/600/clustersched/usage/resumableug/dl_resume_022.html)
- [ModelArts Checkpoint Resume Best Practice — Huawei Cloud](https://support.huaweicloud.com/bestpractice-modelarts/modelarts_llm_train_590221.html)
- [FlashRecovery: Fast Failure Recovery for LLM Training — arXiv](https://arxiv.org/html/2509.03047v1)
- [LowDiff: Efficient Frequent Checkpointing — arXiv](https://arxiv.org/html/2509.04084v2)
- [昇腾 910B FP8 支持说明 — AwesomeAgents](https://awesomeagents.ai/hardware/huawei-ascend-910b/)
- [vLLM-Ascend Environment Variables / Additional Config](https://docs.vllm.ai/projects/ascend/zh-cn/main/user_guide/configuration/additional_config.html)
- [LongCat-2.0-Preview — 美团万亿参数国产算力训练 — DoNews](https://www.donews.com/news/detail/4/6542726.html)
- [昇腾 950 系列规格 — 太平洋科技](https://g.pconline.com.cn/x/1983/19833172.html)
- [昇腾 910C / 950 路线图 — 新浪财经](https://www.sina.cn/news/detail/5212262517965454.html)
