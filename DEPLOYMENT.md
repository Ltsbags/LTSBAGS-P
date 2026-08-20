# ApexBags - Self-Hosted Linux VPS Deployment Guide

This guide provides step-by-step instructions to deploy the **ApexBags B2B Bag Manufacturing Platform** on a clean self-hosted Linux VPS (Ubuntu 22.04 LTS / Debian 12) using Node.js, PM2 process manager, PostgreSQL database, Prisma ORM, and Nginx reverse proxy with free SSL (Let's Encrypt).

---

## 📋 System Requirements
- **OS:** Ubuntu 22.04 LTS or Debian 12
- **RAM:** Minimum 1 GB (2 GB recommended for building Next.js)
- **Disk:** 20 GB SSD
- **Access:** Root or Sudo user access
- **Domain:** A pointed domain name (e.g. `apexbags.com` and `www.apexbags.com`)

---

## 🚀 Step 1: Server Initial Setup & Dependencies

Connect to your server via SSH:
```bash
ssh root@your-server-ip
```

Update system repositories and install essential tooling:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential nginx ufw
```

### Install Node.js (v20 LTS):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Should display v20.x.x
npm -v
```

---

## 🗄️ Step 2: Install & Configure PostgreSQL Database

Install PostgreSQL server:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Create database and database user:
```bash
sudo -i -u postgres psql
```
Inside the PostgreSQL shell, run:
```sql
CREATE DATABASE apexbags_db;
CREATE USER apexbags_user WITH PASSWORD 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE apexbags_db TO apexbags_user;
ALTER DATABASE apexbags_db OWNER TO apexbags_user;
\q
```

---

## 📁 Step 3: Clone & Setup Application Code

Create app directory:
```bash
sudo mkdir -p /var/www/apexbags
sudo chown -R $USER:$USER /var/www/apexbags
cd /var/www/apexbags
```

Clone your project repository (or upload project files):
```bash
git clone <your-repository-url> .
```

Install NPM packages:
```bash
npm install --production=false
```

---

## ⚙️ Step 4: Environment Variables Setup

Create the production `.env` file:
```bash
nano .env
```

Paste the following environment variables:
```env
# Application Settings
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://apexbags.com

# PostgreSQL Database Connection
DATABASE_URL="postgresql://apexbags_user:YourStrongPassword123!@localhost:5432/apexbags_db?schema=public"

# Admin Authentication
ADMIN_EMAIL=admin@apexbags.com
ADMIN_PASSWORD=change_this_secure_password_in_production
```

---

## 🔄 Step 5: Database Schema Migration & Seeding

Generate Prisma Client and push schema to PostgreSQL:
```bash
# Generate Prisma Client types
npx prisma generate

# Apply migrations / push schema to PostgreSQL
npx prisma db push

# (Optional) Seed database with initial products, categories & admin
npx ts-node prisma/seed.ts
```

---

## 🏗️ Step 6: Build Next.js Application

Compile Next.js production build:
```bash
npm run build
```

---

## ⚡ Step 7: Configure PM2 Process Manager

Install PM2 globally:
```bash
sudo npm install -y -g pm2
```

Start Next.js application with PM2:
```bash
pm2 start npm --name "apexbags" -- start
pm2 save
pm2 startup
```
*(Copy and paste the `env` command displayed by `pm2 startup` to enable auto-start on server reboot).*

Check PM2 status:
```bash
pm2 status
pm2 logs apexbags
```

---

## 🌐 Step 8: Configure Nginx Reverse Proxy

Create an Nginx server block configuration:
```bash
sudo nano /etc/nginx/sites-available/apexbags
```

Paste the following Nginx configuration:
```nginx
server {
    listen 80;
    server_name apexbags.com www.apexbags.com;

    # Client body size for image uploads
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }
}
```

Enable site configuration and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/apexbags /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/apexbags /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Step 9: Configure Firewall & SSL (Certbot)

Configure UFW firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

Install Certbot for free HTTPS SSL certificates:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d apexbags.com -d www.apexbags.com
```

Certbot will automatically issue an SSL certificate and redirect HTTP traffic to HTTPS.

---

## 🛠️ Maintenance & Useful Commands

- **Restart Application:** `pm2 restart apexbags`
- **View Live Logs:** `pm2 logs apexbags`
- **Check Database Migration Status:** `npx prisma status`
- **Update Codebase:**
  ```bash
  cd /var/www/apexbags
  git pull
  npm install
  npx prisma db push
  npm run build
  pm2 restart apexbags
  ```

---

🎉 **Congratulations! Your ApexBags platform is live on your self-hosted Linux VPS!**
