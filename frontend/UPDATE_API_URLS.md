# Update Remaining API URLs

The following pages still need to be updated to use API_CONFIG. 
Replace `http://localhost:8000/api` with `${API_CONFIG.BACKEND_URL}`

## Files to Update:

1. **Balance.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
   - Replace: `http://localhost:8000/api/expenses/add-expense` → `${API_CONFIG.BACKEND_URL}/expenses/add-expense`
   - Replace: `http://localhost:8000/api/expenses/remove-expense` → `${API_CONFIG.BACKEND_URL}/expenses/remove-expense`

2. **Bills.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
   - Replace: `http://localhost:8000/api/bills/add-bill` → `${API_CONFIG.BACKEND_URL}/bills/add-bill`
   - Replace: `http://localhost:8000/api/bills/remove-bill` → `${API_CONFIG.BACKEND_URL}/bills/remove-bill`

3. **About.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`

4. **BudgetPlanning.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`
   - Replace: `http://localhost:8000/api/savings/add-saving` → `${API_CONFIG.BACKEND_URL}/savings/add-saving`

5. **AllTransaction.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`

6. **Chart.jsx** - Add `import API_CONFIG from "../config/api";`
   - Replace: `http://localhost:8000/api/users/user/${userId}` → `${API_CONFIG.BACKEND_URL}/users/user/${userId}`

## Quick Find & Replace Pattern:
- Find: `http://localhost:8000/api`
- Replace: `${API_CONFIG.BACKEND_URL}`

