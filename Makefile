serveApi:
	@go run server/cmd/api/main.go

serveClient:
	@npm start --prefix client

local:
	make -j 2 serveApi serveClient

buildApi:
	@go build -o bin/api server/cmd/api/main.go

buildClient:
	@npm run build --prefix client