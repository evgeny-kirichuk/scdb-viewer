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
		"Consistency": cluster.Consistency,
		"Hosts":       cluster.Hosts,
		"Keyspace":    cluster.Keyspace,
		"Timeout":     cluster.Timeout,
		"RetryPolicy": cluster.RetryPolicy,
		"CQLVersion": cluster.CQLVersion,
		"ProtoVersion": cluster.ProtoVersion,
		"ConnectTimeout": cluster.ConnectTimeout,
		"WriteTimeout": cluster.WriteTimeout,
		"Port": cluster.Port,
		"NumConns": cluster.NumConns,
		"MaxRequestsPerConn": cluster.MaxRequestsPerConn,
		"SocketKeepalive": cluster.SocketKeepalive,
		"MaxPreparedStmts": cluster.MaxPreparedStmts,
		"MaxRoutingKeyInfo": cluster.MaxRoutingKeyInfo,
		"PageSize": cluster.PageSize,
		"SerialConsistency": cluster.SerialConsistency,
		"DefaultTimestamp": cluster.DefaultTimestamp,
		"ReconnectInterval": cluster.ReconnectInterval,
		"MaxWaitSchemaAgreement": cluster.MaxWaitSchemaAgreement,
		"IgnorePeerAddr": cluster.IgnorePeerAddr,
		"DisableInitialHostLookup": cluster.DisableInitialHostLookup,
		"DisableSkipMetadata": cluster.DisableSkipMetadata,
		"DefaultIdempotence": cluster.DefaultIdempotence,
		"WriteCoalesceWaitTime": cluster.WriteCoalesceWaitTime,
		"DisableShardAwarePort": cluster.DisableShardAwarePort,
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

	apiv1.Get("/cluster", func(c *fiber.Ctx) error {
		res := scylla.SelectClusterInfo(session, logger)
		res["cluster"] = ClusterConfigToMap(cluster)

		return c.JSON(res)
	})

	apiv1.Get("/status", func(c *fiber.Ctx) error {
		if session == nil {
			return c.JSON(map[string]string{"status": "disconnected"})
		} else {
			return c.JSON(map[string]string{"status": "connected"})
		}
	})

	apiv1.Get("/connect", func(c *fiber.Ctx) error {
		if session == nil {
			cluster = scylla.CreateCluster(gocql.Quorum, "scylla-node1", "scylla-node2", "scylla-node3")
			cluster.HostFilter = gocql.WhiteListHostFilter("scylla-node1")

			newSession, err := gocql.NewSession(*cluster)
			if err != nil {
				return c.JSON(map[string]string{"status": "disconnected"})
			}
			session = newSession

			return c.JSON(map[string]string{"status": "connected"})
		} else {
			return c.JSON(map[string]string{"status": "connected"})
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
