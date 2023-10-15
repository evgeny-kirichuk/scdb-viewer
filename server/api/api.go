package api

import (
	"flag"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/skratchdot/open-golang/open"

	view "github.com/evgeny-kirichuk/scdb-viewer/client"
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

	// routes
	apiv1.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
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
