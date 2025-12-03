#!/bin/bash

# ==================================
# Deployment script for Admin Panel
# ==================================

APP_NAME="tdhv2-admin"
APP_DIR="/home/ubuntu/tdhv2-admin"
BRANCH="main"
DEPLOY_DIR="/var/www/vhosts/frontend"

# Go to app directory
cd $APP_DIR || exit

# Pull latest changes
echo "Pulling latest changes from $BRANCH..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building the app..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# Deploy new build
echo "Deploying new build"
sudo rm -rf $DEPLOY_DIR
sudo cp -r dist $DEPLOY_DIR

# Fix permissions
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

# Restart nginx server
echo "Restarting server"
sudo systemctl restart nginx

echo "Deployment completed successfully!"