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
        time: true,
        max_memory_restart: "1G", // 메모리 제한을 초과하면 자동으로 재시작
        instances: "max", // 서버의 CPU 코어 수에 맞게 인스턴스 수를 자동 조정
        autorestart: true, // 애플리케이션이 비정상 종료될 경우 자동 재시작
        merge_logs: true, // 로그 파일을 병합하여 하나로 출력
        log_type: "json", // 로그 형식을 JSON으로 설정
    }]
};
