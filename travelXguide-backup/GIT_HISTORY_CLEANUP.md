# Git History Cleanup Guide

## 🚨 **WARNING: This will rewrite Git history**

This process will completely remove the credentials from your Git history, but it will also change commit hashes.

## **Step 1: Backup Your Repository**
```bash
# Create a backup of your current repository
cp -r travelXguide-main travelXguide-main-backup
```

## **Step 2: Remove Credentials from Git History**

### **Option A: Using BFG Repo-Cleaner (Recommended)**

1. **Download BFG Repo-Cleaner:**
   - Go to [https://rtyley.github.io/bfg-repo-cleaner/](https://rtyley.github.io/bfg-repo-cleaner/)
   - Download the JAR file

2. **Run BFG to remove credentials:**
   ```bash
   # Navigate to your repository
   cd travelXguide-main
   
   # Run BFG to remove the credentials
   java -jar bfg.jar --replace-text passwords.txt .
   ```

3. **Create passwords.txt file:**
   ```bash
   # Create a file with the credentials to remove
   echo "YOUR_GOOGLE_CLIENT_ID" > passwords.txt
   echo "YOUR_GOOGLE_CLIENT_SECRET" >> passwords.txt
   ```

4. **Clean up and push:**
   ```bash
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force-with-lease origin main
   ```

### **Option B: Using Git Filter-Branch (Alternative)**

```bash
# Remove the credentials from all commits
git filter-branch --force --index-filter \
  'git ls-files -z | xargs -0 sed -i "s/YOUR_GOOGLE_CLIENT_ID/your-google-client-id-here/g"' \
  --prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
  'git ls-files -z | xargs -0 sed -i "s/YOUR_GOOGLE_CLIENT_SECRET/your-google-client-secret-here/g"' \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force-with-lease origin main
```

## **Step 3: Verify Cleanup**

After cleanup, verify that credentials are removed:
```bash
# Search for any remaining credentials
git log --all --full-history -- "YOUR_GOOGLE_CLIENT_ID"
git log --all --full-history -- "YOUR_GOOGLE_CLIENT_SECRET"
```

## **⚠️ Important Notes**

1. **This rewrites Git history** - All commit hashes will change
2. **Force push required** - You'll need to force push to update the remote
3. **Collaborators affected** - Anyone else working on this repo will need to re-clone
4. **Backup first** - Always backup before doing this

## **Alternative: Simple Solution**

If you don't want to rewrite history, just use **Option 1** above and allow the secrets in GitHub. This is fine for development repositories.

---

**Recommendation**: Use Option 1 (allow secrets) for now, and consider the cleanup later if needed for production. 