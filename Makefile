serveApi:
	@go run cmd/viewer/main.go

serveClient:
	@npm start --prefix client

local:
	make -j 2 serveApi serveClient

buildClient:
	@npm run build --prefix client

buildServer:
	@go build -o bin/api cmd/viewer/main.go
