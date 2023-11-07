package scylla

import (
	"fmt"

	"github.com/gocql/gocql"
	"go.uber.org/zap"
)

func SelectTables(session *gocql.Session, logger *zap.Logger) map[string]map[string]interface{} {
	logger.Info("Displaying Results1234:")
	tablesIt := session.Query("SELECT * FROM system_schema.tables").Iter()

	defer func() {
		if err := tablesIt.Close(); err != nil {
			logger.Warn("select system_schema.tables", zap.Error(err))
		}
	}()

	tablesValues := map[string]map[string]interface{}{}

	for {
		// New map each iteration
		row := make(map[string]interface{})
		if !tablesIt.MapScan(row) {
			break
		}
		// Do things with row
		if tableName, ok := row["table_name"]; ok {
			tablesValues[fmt.Sprintf("%v", tableName)] = row
		}
	}

	return tablesValues
}

func SelectKeyspaces(session *gocql.Session, logger *zap.Logger) map[string]map[string]interface{} {
	logger.Info("Displaying Results123:")
	keyspacesIt := session.Query("SELECT * FROM system_schema.keyspaces").Iter()

	defer func() {
		if err := keyspacesIt.Close(); err != nil {
			logger.Warn("select system_schema.keyspaces", zap.Error(err))
		}
	}()

	keyspacesValues := map[string]map[string]interface{}{}

	for {
		// New map each iteration
		row := make(map[string]interface{})
		if !keyspacesIt.MapScan(row) {
			break
		}
		// Do things with row
		if keyspaceName, ok := row["keyspace_name"]; ok {
			keyspacesValues[fmt.Sprintf("%v", keyspaceName)] = row
		}
	}

	return keyspacesValues
}

func SelectPeersInfo(session *gocql.Session, logger *zap.Logger) map[string]map[string]interface{} {
	peersIt := session.Query("SELECT * FROM system.peers").Iter()
	localIt := session.Query("SELECT * FROM system.local").Iter()
	defer func() {
		if err := peersIt.Close(); err != nil {
			logger.Warn("select system.peers", zap.Error(err))
		}
		if err := localIt.Close(); err != nil {
			logger.Warn("select system.local", zap.Error(err))
		}
	}()

	values := map[string]map[string]interface{}{}

	for {
		// New map each iteration
		row := make(map[string]interface{})
		if !peersIt.MapScan(row) {
			break
		}
		// Do things with row
		if peer, ok := row["peer"]; ok {
			values["peer."+fmt.Sprintf("%v", peer)] = row
		}
	}
	for {
		// New map each iteration
		row := make(map[string]interface{})
		if !localIt.MapScan(row) {
			break
		}
		// Do things with row
		if addr, ok := row["broadcast_address"]; ok {
			values["loc."+fmt.Sprintf("%v", addr)] = row
		}
	}

	return values
}

func SelectClients(session *gocql.Session, logger *zap.Logger) map[string]map[string]interface{} {
	logger.Info("Displaying Clients:")
	it := session.Query("SELECT * FROM system.clients").Iter()

	defer func() {
		if err := it.Close(); err != nil {
			logger.Warn("select system.clients", zap.Error(err))
		}
	}()

	values := map[string]map[string]interface{}{}

	for {
		// New map each iteration
		row := make(map[string]interface{})
		if !it.MapScan(row) {
			break
		}
		// Do things with row
		if addr, ok := row["address"]; ok {
			values[fmt.Sprintf("%v", addr)] = row
		}
	}

	return values
}
// query := session.Query("SELECT * FROM system.clients")