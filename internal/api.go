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
)

var config = fiber.Config{
	ErrorHandler: func(c *fiber.Ctx, err error) error {
		return c.JSON(map[string]string{"error": err.Error()})
	},
}

func ClusterConfigToMap(cluster *gocql.ClusterConfig) map[string]interface{} {
	return map[string]interface{}{
		"Hosts":       cluster.Hosts,
		"Consistency": cluster.Consistency,
		"CQLVersion": cluster.CQLVersion,
		"SerialConsistency": cluster.SerialConsistency,
	}
}

func StartServer() {
	addr := flag.String("addr", ":8000", "http service address")
	flag.Parse()

	var (
		session *gocql.Session
		cluster *gocql.ClusterConfig
	)
	defer session.Close()

	logger := log.CreateLogger("info")

	app := fiber.New(config)
	apiv1 := app.Group("/api/v1")



	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
	}))

	// routes
	apiv1.Get("/tables", func(c *fiber.Ctx) error {
		res := scylla.SelectTables(session, logger)
		return c.JSON(res)
	})

	apiv1.Get("/keyspaces", func(c *fiber.Ctx) error {
		res := scylla.SelectKeyspaces(session, logger)
		return c.JSON(res)
	})

	apiv1.Get("/peers", func(c *fiber.Ctx) error {
		res := scylla.SelectPeersInfo(session, logger)
		return c.JSON(res)
	})

	apiv1.Get("/clients", func(c *fiber.Ctx) error {
		res := scylla.SelectClients(session, logger)
		return c.JSON(res)
	})



	apiv1.Get("/status", func(c *fiber.Ctx) error {
		if session == nil {
			return c.JSON(map[string]string{"status": "idle"})
		} else {
			return c.JSON(map[string]string{"status": "active"})
		}
	})

	apiv1.Get("/connect", func(c *fiber.Ctx) error {
		if session == nil {
			cluster = scylla.CreateCluster(gocql.Quorum, "scylla-node1", "scylla-node2", "scylla-node3", "scylla-node4", "scylla-node5", "scylla-node6")
			cluster.HostFilter = gocql.WhiteListHostFilter("scylla-node1")

			newSession, err := cluster.CreateSession()
			if err != nil {
				return c.JSON(map[string]string{"status": "loading"})
			}
			session = newSession

			return c.JSON(map[string]string{"status": "active"})
		} else {
			return c.JSON(map[string]string{"status": "active"})
		}
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
