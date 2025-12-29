package com.info.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnexionDB {
    
    private static ConnexionDB instance;
    private Connection connection;
    
    // Modifier selon votre configuration MySQL
    private final String url = "jdbc:mysql://localhost:3306/tp2db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&useUnicode=true&characterEncoding=UTF-8";
    private final String login = "root";
    private final String password = ""; // Mot de passe vide
    
    private ConnexionDB() {
        try {
            // Charger le driver MySQL
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("✅ Driver MySQL chargé.");
            
            // Établir la connexion
            connection = DriverManager.getConnection(url, login, password);
            
            if (connection != null && !connection.isClosed()) {
                System.out.println("✅ Connexion MySQL réussie : " + connection.getCatalog());
            } else {
                System.err.println("❌ Connexion MySQL échouée");
            }
        } catch (ClassNotFoundException e) {
            System.err.println("❌ Driver MySQL manquant : " + e.getMessage());
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("❌ Erreur connexion MySQL : " + e.getMessage());
            System.err.println("URL: " + url);
            System.err.println("Utilisateur: " + login);
            e.printStackTrace();
            connection = null;
        }
    }
    
    public static synchronized Connection getConnexion() {
        if (instance == null) {
            instance = new ConnexionDB();
        } else {
            try {
                if (instance.connection == null || instance.connection.isClosed()) {
                    System.out.println("🔄 Reconnexion à la base de données...");
                    instance = new ConnexionDB();
                }
            } catch (SQLException e) {
                System.err.println("❌ Erreur vérification connexion : " + e.getMessage());
                instance = new ConnexionDB();
            }
        }
        
        if (instance.connection == null) {
            System.err.println("❌ Impossible d'obtenir la connexion à la base de données");
        }
        return instance.connection;
    }
    
    public static boolean testConnexion() {
        try {
            Connection conn = getConnexion();
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("❌ Test connexion échoué : " + e.getMessage());
            return false;
        }
    }
    
    public static void closeConnexion() {
        if (instance != null && instance.connection != null) {
            try {
                if (!instance.connection.isClosed()) {
                    instance.connection.close();
                    System.out.println("✅ Connexion MySQL fermée.");
                }
            } catch (SQLException e) {
                System.err.println("❌ Erreur fermeture connexion : " + e.getMessage());
            }
        }
    }
}