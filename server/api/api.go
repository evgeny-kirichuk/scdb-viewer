package api

import (
	"flag"

	"github.com/gofiber/fiber/v2"
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
	app.Static("/", "../client/build/")
	apiv1.Get("/", func (c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})


  app.Get("*", func(c *fiber.Ctx) error {
    return c.SendFile("../client/build/index.html")
  })

	app.Listen(*addr)
}
