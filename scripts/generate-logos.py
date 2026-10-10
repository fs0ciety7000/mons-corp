"""Generate logo explorations with Nano Banana Pro (Gemini image API).

Usage: GEMINI_API_KEY=... python3 scripts/generate-logos.py <refs_dir> <out_dir> [job_id ...]
Reference images expected in <refs_dir>: wheel.jpg, volute.jpg.
"""
import base64, json, os, sys, urllib.request, concurrent.futures as cf

MODEL = os.environ.get("LOGO_MODEL", "gemini-3-pro-image")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
here = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(here, "logo-jobs.json")))
refs_dir, out_dir = sys.argv[1], sys.argv[2]
only = set(sys.argv[3:])


def run(job):
    parts = [{"text": cfg["prefix"] + job["prompt"]}]
    if job["ref"] != "none":
        data = open(os.path.join(refs_dir, job["ref"] + ".jpg"), "rb").read()
        parts.append({"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(data).decode()}})
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": job["aspect"]}},
    }
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={
        "content-type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    try:
        res = json.load(urllib.request.urlopen(req, timeout=240))
    except urllib.error.HTTPError as e:
        return f"{job['id']}: HTTP {e.code} {e.read()[:300]!r}"
    for cand in res.get("candidates", []):
        for p in cand.get("content", {}).get("parts", []):
            blob = p.get("inline_data") or p.get("inlineData")
            if blob:
                path = os.path.join(out_dir, job["id"] + ".png")
                open(path, "wb").write(base64.b64decode(blob["data"]))
                return f"{job['id']}: ok"
    return f"{job['id']}: no image ({json.dumps(res)[:300]})"


jobs = [j for j in cfg["jobs"] if not only or j["id"] in only]
with cf.ThreadPoolExecutor(max_workers=4) as pool:
    for line in pool.map(run, jobs):
        print(line, flush=True)
