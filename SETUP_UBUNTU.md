# ZMK Keymap Editor - Ubuntu Server Setup

## Installation Steps

Run these commands on your Ubuntu server:

```bash
# 1. Copy the project to the server
sudo mkdir -p /opt/ZMK-keymap-editor
sudo cp -r /mnt/d/Developer/ZMK-keymap-editor/* /opt/ZMK-keymap-editor/
cd /opt/ZMK-keymap-editor

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.production .env

# 4. Build the React app with correct PUBLIC_URL (if not already done)
cd app
PUBLIC_URL=/zmk npm run build
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
