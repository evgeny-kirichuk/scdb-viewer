package api

import (
	"flag"
	"net/http"

	view "github.com/evgeny-kirichuk/scdb-viewer/client"
	"github.com/evgeny-kirichuk/scdb-viewer/internal/log"
	"github.com/evgeny-kirichuk/scdb-viewer/internal/scylla"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/skratchdot/open-golang/open"
	"go.uber.org/zap"
)

var config = fiber.Config{
	ErrorHandler: func(c *fiber.Ctx, err error) error {
		return c.JSON(map[string]string{"error": err.Error()})
	},
}

func StartServer() {
	addr := flag.String("addr", ":8000", "http service address")
	flag.Parse()

	logger := log.CreateLogger("info")

	cluster := scylla.CreateCluster(gocql.Quorum, "system", "scylla-node1", "scylla-node2", "scylla-node3")
	session, err := gocql.NewSession(*cluster)
	if err != nil {
		logger.Fatal("unable to connect to scylla", zap.Error(err))
	}
	defer session.Close()

	app := fiber.New(config)
	apiv1 := app.Group("/api/v1")

	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	// routes
	apiv1.Get("/tabless", func(c *fiber.Ctx) error {
		res := scylla.SelectTables(session, logger)
		return c.JSON(res)
	})

	apiv1.Get("/keyspaces", func(c *fiber.Ctx) error {
		res := scylla.SelectKeyspaces(session, logger)
		return c.JSON(res)
	})

	// static files embedded in binary
	app.Use("/", filesystem.New(filesystem.Config{
		Root:         http.FS(view.Build),
		Browse:       true,
		PathPrefix:   "/build",
		Index:        "index.html",
		NotFoundFile: "/build/index.html",
	}))

	open.Run("http://localhost:8000")
	app.Listen(*addr)
}
