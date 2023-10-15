package api

import (
	"flag"
	"net/http"

	view "github.com/evgeny-kirichuk/scdb-viewer/client"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/skratchdot/open-golang/open"
)

var config = fiber.Config{
	ErrorHandler: func(c *fiber.Ctx, err error) error {
		return c.JSON(map[string]string{"error": err.Error()})
	},
}

func StartServer() {
	addr := flag.String("addr", ":5500", "http service address")
	flag.Parse()

	app := fiber.New(config)
	apiv1 := app.Group("/api/v1")

	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	// routes
	apiv1.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(map[string]string{"message": "Hello, World!"})
	})

	// static files embedded in binary
	app.Use("/", filesystem.New(filesystem.Config{
		Root:         http.FS(view.Build),
		Browse:       true,
		PathPrefix:   "/build",
		Index:        "index.html",
		NotFoundFile: "/build/index.html",
	}))

	open.Run("http://localhost:5500")
	app.Listen(*addr)
}
