module.exports = {
    apps: [{
        name: "react-LoL",
        script: "serve",
        env: {
            PM2_SERVE_PATH: "./build",
            PM2_SERVE_PORT: 9090,
            PM2_SERVE_SPA: "true",
            PM2_SERVE_HOMEPAGE: "/index.html"
        },
        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "logs/react-app-error.log",
        out_file: "logs/react-app-out.log",
        log_file: "logs/react-app-combined.log",
        time: true
    }]
};