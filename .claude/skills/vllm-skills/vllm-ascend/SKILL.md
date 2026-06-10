---
name: vllm-ascend
description: "Deploy vLLM on Huawei Ascend NPUs using the vllm-ascend plugin with Docker. Supports Atlas A2/A3/300I hardware auto-detection, pre-built images, and source builds."
version: 1.0.0
author: vLLM Team
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [vLLM, Ascend, NPU, Huawei, Deployment, Docker]
    related_skills: [vllm-deploy-docker, vllm-deploy-k8s, vllm-deploy-simple]
  tags: [vLLM, Ascend, NPU, Huawei, Deployment, Docker]
---

# vLLM Ascend NPU Deployment

Deploy vLLM on Huawei Ascend NPUs using the [vllm-ascend](https://github.com/vllm-project/vllm-ascend) plugin. Pre-built images are available at [quay.io/ascend/vllm-ascend](https://quay.io/repository/ascend/vllm-ascend).

## Prerequisites

- Docker Engine installed (Docker 20.10+ recommended)
- Huawei Ascend NPU(s) with drivers installed
- A Hugging Face token if pulling private models: `HF_TOKEN`

## Auto-detect Image Tag

Select the correct image based on hardware (A2 vs A3 vs 300I). The image tag refers to the **container base OS**; use Ubuntu images (no `-openeuler` suffix) for compatibility across hosts:

```bash
# Hardware: dmidecode Product Name (A2, A3, or 310p)
PRODUCT=$(dmidecode -t system 2>/dev/null | grep -i "Product Name" | head -1)
if echo "$PRODUCT" | grep -qiE "\bA3\b"; then
  HW_SUFFIX="-a3"
elif echo "$PRODUCT" | grep -qiE "310|300I"; then
  HW_SUFFIX="-310p"
else
  HW_SUFFIX=""   # A2 (default)
fi

IMAGE="quay.io/ascend/vllm-ascend:v0.14.0rc1${HW_SUFFIX}"
echo "Using image: $IMAGE"
```

| Hardware | Image tag |
|----------|-----------|
| Atlas A2 | `v0.14.0rc1` |
| Atlas A3 | `v0.14.0rc1-a3` |
| Atlas 300I | `v0.14.0rc1-310p` |

## Run Ascend Container and Start Server

The vllm-ascend image drops into an interactive bash. Run the container, then start the server inside:

```bash
# Set IMAGE (use auto-detect above or pick manually, e.g. for A2):
export IMAGE=quay.io/ascend/vllm-ascend:v0.14.0rc1

# Build --device args for all NPU devices (A2: davinci0-7, A3: davinci0-15)
DEVS=""
for d in /dev/davinci[0-9]*; do [ -e "$d" ] && DEVS="$DEVS --device $d"; done
# Or use specific devices: DEVS="--device /dev/davinci0 --device /dev/davinci1"

docker run --rm --privileged \
  --name vllm-ascend \
  --shm-size=1g \
  $DEVS \
  --device /dev/davinci_manager \
  --device /dev/devmm_svm \
  --device /dev/hisi_hdc \
  -v /usr/local/dcmi:/usr/local/dcmi \
  -v /usr/local/bin/npu-smi:/usr/local/bin/npu-smi \
  -v /usr/local/Ascend/driver/lib64:/usr/local/Ascend/driver/lib64 \
  -v /usr/local/Ascend/driver/version.info:/usr/local/Ascend/driver/version.info \
  -v /etc/ascend_install.info:/etc/ascend_install.info \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -v ~/.cache/modelscope:/root/.cache/modelscope \
  -e HF_TOKEN=$HF_TOKEN \
  -e VLLM_USE_MODELSCOPE=true \
  -p 8000:8000 \
  -it $IMAGE bash
```

**Inside the container**, start the vLLM server:

```bash
# Optional: use ModelScope for faster model download in China
export VLLM_USE_MODELSCOPE=true

# Start vLLM OpenAI-compatible server (background)
vllm serve Qwen/Qwen2.5-1.5B-Instruct --port 8000 &
```

For **multi-node** deployment, add `--net=host` and mount `hccn_tool`:

```bash
-v /usr/local/Ascend/driver/tools/hccn_tool:/usr/local/Ascend/driver/tools/hccn_tool
```

## Build Ascend Image from Source

```bash
git clone https://github.com/vllm-project/vllm-ascend.git
cd vllm-ascend
docker build -t vllm-ascend:dev -f Dockerfile .
# For A3: use Dockerfile.a3
```

## API Test

From the host (or inside container):

```bash
curl -s http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen2.5-1.5B-Instruct","messages":[{"role":"user","content":"Who are you?"}],"max_tokens":128}'
```

## References

- vllm-ascend: https://github.com/vllm-project/vllm-ascend
- vllm-ascend docs: https://docs.vllm.ai/projects/ascend/en/latest/
