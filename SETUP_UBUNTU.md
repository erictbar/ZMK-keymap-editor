# ZMK Keymap Editor - Ubuntu Server Setup

## Installation Steps

Run these commands on your Ubuntu server:

```bash
# 1. Clone your fork to the server (recommended)
cd /opt
sudo git clone https://github.com/erictbar/ZMK-keymap-editor.git
sudo chown -R $USER:$USER /opt/ZMK-keymap-editor
cd /opt/ZMK-keymap-editor

# OR if copying files:
# sudo mkdir -p /opt/ZMK-keymap-editor
# sudo cp -r /path/to/ZMK-keymap-editor/* /opt/ZMK-keymap-editor/
# sudo chown -R $USER:$USER /opt/ZMK-keymap-editor
# cd /opt/ZMK-keymap-editor

# 2. Install dependencies (this will also install app dependencies)
npm install

# 3. Copy environment file
cp .env.production .env

# 3.5. Create placeholder for private key (GitHub is disabled by default)
# This prevents errors even though ENABLE_GITHUB=false
touch private-key.pem

# 4. Build the React app with correct PUBLIC_URL and API_BASE_URL
cd app
REACT_APP_API_BASE_URL=https://sh.erictb.com/zmk REACT_APP_ENABLE_LOCAL=true PUBLIC_URL=/zmk npm run build
cd ..

# 5. Copy build files to web directory
sudo mkdir -p /opt/Homepage/zmk
sudo cp -r app/build/* /opt/Homepage/zmk/

# 6. Install systemd service
sudo cp zmk-keymap-editor.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable zmk-keymap-editor
sudo systemctl start zmk-keymap-editor

# 7. Check service status
sudo systemctl status zmk-keymap-editor

# 8. Reload Caddy
sudo caddy reload --config /opt/caddy/Caddyfile.txt
```

## Service Management

```bash
# View logs
sudo journalctl -u zmk-keymap-editor -f

# Restart service
sudo systemctl restart zmk-keymap-editor

# Stop service
sudo systemctl stop zmk-keymap-editor

# Disable auto-start
sudo systemctl disable zmk-keymap-editor
```

## Port Configuration
- Backend API: Port 8088
- Web URL: https://sh.erictb.com/zmk/

## Troubleshooting

If the service fails to start, check:
1. Node.js is installed: `node --version`
2. Port 8088 is available: `sudo netstat -tlnp | grep 8088`
3. Permissions on /opt/ZMK-keymap-editor
4. Service logs: `sudo journalctl -u zmk-keymap-editor -n 50`
5. Missing private-key.pem: `touch /opt/ZMK-keymap-editor/private-key.pem` (if ENABLE_GITHUB=false)
6. react-scripts permission denied: `cd /opt/ZMK-keymap-editor/app && chmod +x node_modules/.bin/*`
