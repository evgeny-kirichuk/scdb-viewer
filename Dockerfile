FROM golang:latest
RUN ["go", "install", "github.com/cosmtrek/air@latest"]
WORKDIR /cmd/viewer
ENTRYPOINT ["air"]