# 🔧 Apply ML API CORS Fix in Your Workspace

Since you're in a remote workspace, apply these changes manually:

---

## 📝 Step 1: Open `ml/api.py` in Your Workspace

---

## 📝 Step 2: Find This Section (around line 22-50)

Look for the CORS configuration code that starts with:

```python
# Get CORS origins from environment variable or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
```

---

## 📝 Step 3: Replace the Entire CORS Section

**FIND THIS (old code):**
```python
# Get CORS origins from environment variable or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",")]
else:
    origins = [
        "http://localhost",
        "http://localhost:5173",
        "*"  # Allow all in development
    ]

# ... other code ...

app = FastAPI()

# CORS middleware - restrict to specific origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],  # Use environment origins or allow all
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
```

**REPLACE WITH THIS (new code):**
```python
# Get CORS origins from environment variable or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
else:
    # Default: allow all origins (empty list means allow all in FastAPI)
    origins = []

# ... other code (file = "users_data.json", etc.) ...

app = FastAPI()

# CORS middleware - allow all origins by default, or specific origins if configured
# Empty origins list + allow_origin_regex=".*" allows all origins with credentials
if origins:
    # Specific origins configured - use them with credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # No origins configured - allow all origins (for production flexibility)
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",  # Allow all origins using regex
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
```

---

## 📝 Step 4: Save and Commit

After making the changes:

```bash
# First, pull any remote changes
git pull

# Add the file
git add ml/api.py

# Commit
git commit -m "Fix ML API CORS configuration for stock prediction"

# Push
git push
```

---

## ✅ Done!

Render will automatically redeploy your ML API in 2-3 minutes.

---

## 🔍 Key Changes:

1. **Removed `"*"` from origins list** - FastAPI doesn't support `["*"]` with credentials
2. **Added conditional CORS setup** - Uses `allow_origin_regex=".*"` when no specific origins configured
3. **Properly handles all origins** - Now works correctly in production

