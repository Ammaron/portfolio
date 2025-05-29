# Deployment Instructions for mrmcdonald.org

This document provides instructions for deploying your portfolio website to Linode.

## Prerequisites

1. A Linode account
2. Domain name (mrmcdonald.org) with DNS access
3. SSH access to your Linode server

## Deployment Steps

### 1. Server Setup

1. Create a new Linode instance (recommended: Shared CPU, 2GB RAM)
2. Choose Ubuntu 22.04 LTS as the operating system
3. Set a strong root password
4. Deploy the server

### 2. Domain Configuration

1. Log in to your domain registrar
2. Point your domain (mrmcdonald.org) to Linode's nameservers:
   - ns1.linode.com
   - ns2.linode.com
   - ns3.linode.com
   - ns4.linode.com
   - ns5.linode.com
3. In Linode, create DNS records:
   - A record: @ pointing to your Linode IP
   - A record: www pointing to your Linode IP
   - CNAME record: * pointing to @

### 3. Server Configuration

1. SSH into your Linode server:
   ```
   ssh root@your-linode-ip
   ```

2. Update the system:
   ```
   apt update && apt upgrade -y
   ```

3. Install Node.js and npm:
   ```
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   apt install -y nodejs
   ```

4. Install Nginx:
   ```
   apt install -y nginx
   ```

5. Configure firewall:
   ```
   apt install -y ufw
   ufw allow 'Nginx Full'
   ufw allow OpenSSH
   ufw enable
   ```

### 4. Website Deployment

1. Create a deployment user:
   ```
   adduser deploy
   usermod -aG sudo deploy
   ```

2. Switch to the deploy user:
   ```
   su - deploy
   ```

3. Create website directory:
   ```
   mkdir -p ~/websites/mrmcdonald.org
   ```

4. Upload your website files to the server:
   - Option 1: Use SCP:
     ```
     scp -r /path/to/portfolio_website/* deploy@your-linode-ip:~/websites/mrmcdonald.org/
     ```
   - Option 2: Clone from Git repository (if you've pushed your code to Git)

5. Install dependencies and build the site:
   ```
   cd ~/websites/mrmcdonald.org
   npm install
   npm run build
   ```

6. Install PM2 to manage the Node.js process:
   ```
   npm install -g pm2
   ```

7. Start the Next.js application:
   ```
   pm2 start npm --name "mrmcdonald" -- start
   pm2 save
   pm2 startup
   ```

### 5. Nginx Configuration

1. Create an Nginx configuration file:
   ```
   sudo nano /etc/nginx/sites-available/mrmcdonald.org
   ```

2. Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name mrmcdonald.org www.mrmcdonald.org;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the site:
   ```
   sudo ln -s /etc/nginx/sites-available/mrmcdonald.org /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 6. SSL Configuration

1. Install Certbot:
   ```
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```
   sudo certbot --nginx -d mrmcdonald.org -d www.mrmcdonald.org
   ```

3. Follow the prompts to complete the SSL setup

### 7. Verify Deployment

1. Visit your website at https://mrmcdonald.org
2. Test all pages and functionality
3. Verify that language switching works correctly
4. Test the site on mobile devices

## Updating Content

### Updating Existing Content

1. SSH into your server:
   ```
   ssh deploy@your-linode-ip
   ```

2. Navigate to your website directory:
   ```
   cd ~/websites/mrmcdonald.org
   ```

3. Pull the latest changes (if using Git):
   ```
   git pull
   ```

4. Or upload new files directly:
   ```
   # From your local machine
   scp -r /path/to/updated/files/* deploy@your-linode-ip:~/websites/mrmcdonald.org/
   ```

5. Rebuild and restart the application:
   ```
   npm install
   npm run build
   pm2 restart mrmcdonald
   ```

### Adding New Content

#### Teachers Pay Teachers Products

1. Edit the file `src/app/teachers-pay-teachers/page.tsx`
2. Add new products to the `products` array following the existing format
3. Save the file and follow the update steps above

#### English Classes Information

1. Edit the file `src/app/english-classes/page.tsx`
2. Update class information, pricing, or testimonials as needed
3. Save the file and follow the update steps above

#### Adding New Pages

1. Create a new directory in `src/app/` for your page
2. Add a `page.tsx` file with your content
3. Update the navigation in `src/components/Navbar.tsx` to include the new page
4. Add translations for the new page in `src/i18n/translations.ts`
5. Follow the update steps above

## Troubleshooting

- **Website not loading**: Check PM2 status with `pm2 status` and Nginx status with `sudo systemctl status nginx`
- **SSL certificate issues**: Run `sudo certbot renew --dry-run` to check certificate renewal
- **Language switching not working**: Verify the i18n context is properly implemented in all components

## Maintenance

- SSL certificates will auto-renew via Certbot's cron job
- Regularly update Node.js and npm packages for security
- Monitor server resources using Linode's dashboard
