package com.info.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.info.db.ConnexionDB;
import com.info.model.Person;

public class PersonServiceImpl implements PersonService {

    private Connection connection;

    /**
     * Constructeur : Initialise la connexion.
     */
    public PersonServiceImpl() {
        this.connection = ConnexionDB.getConnexion();
        if (this.connection == null) {
            System.err.println("❌ Connexion MySQL non disponible.");
        } else {
            System.out.println("✅ Service initialisé avec connexion BD");
        }
    }

    @Override
    public boolean addPerson(Person p) {
        if (connection == null) {
            System.err.println("❌ Connexion null dans addPerson");
            return false;
        }
        
        String sql = "INSERT INTO person (name, age) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, p.getName());
            pstmt.setInt(2, p.getAge());
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        p.setId(generatedKeys.getInt(1));
                        System.out.println("✅ Personne ajoutée avec ID: " + p.getId());
                    }
                }
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("❌ Erreur SQL addPerson: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deletePerson(int id) {
        if (connection == null) {
            System.err.println("❌ Connexion null dans deletePerson");
            return false;
        }
        
        String sql = "DELETE FROM person WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            boolean deleted = pstmt.executeUpdate() > 0;
            if (deleted) {
                System.out.println("✅ Personne supprimée ID: " + id);
            } else {
                System.out.println("⚠️ Aucune personne trouvée avec ID: " + id);
            }
            return deleted;
        } catch (SQLException e) {
            System.err.println("❌ Erreur deletePerson: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Person getPerson(int id) {
        if (connection == null) {
            System.err.println("❌ Connexion null dans getPerson");
            return null;
        }
        
        String sql = "SELECT * FROM person WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Person person = new Person();
                    person.setId(rs.getInt("id"));
                    person.setName(rs.getString("name"));
                    person.setAge(rs.getInt("age"));
                    System.out.println("✅ Personne trouvée ID: " + id);
                    return person;
                } else {
                    System.out.println("⚠️ Personne non trouvée ID: " + id);
                    return null;
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Erreur getPerson: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Person getPersonByName(String name) {
        if (connection == null) {
            System.err.println("❌ Connexion null dans getPersonByName");
            return null;
        }
        
        String sql = "SELECT * FROM person WHERE name = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, name);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    Person person = new Person();
                    person.setId(rs.getInt("id"));
                    person.setName(rs.getString("name"));
                    person.setAge(rs.getInt("age"));
                    System.out.println("✅ Personne trouvée nom: " + name);
                    return person;
                } else {
                    System.out.println("⚠️ Personne non trouvée nom: " + name);
                    return null;
                }
            }
        } catch (SQLException e) {
            System.err.println("❌ Erreur getPersonByName: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Person[] getAllPersons() {
        if (connection == null) {
            System.err.println("❌ Connexion null dans getAllPersons");
            return new Person[0];
        }
        
        String sql = "SELECT * FROM person ORDER BY id";
        List<Person> persons = new ArrayList<>();
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Person person = new Person();
                person.setId(rs.getInt("id"));
                person.setName(rs.getString("name"));
                person.setAge(rs.getInt("age"));
                persons.add(person);
            }
            System.out.println("✅ " + persons.size() + " personnes chargées");
        } catch (SQLException e) {
            System.err.println("❌ Erreur getAllPersons: " + e.getMessage());
            e.printStackTrace();
        }
        return persons.toArray(new Person[0]);
    }

    @Override
    public boolean updatePerson(Person p) {
        if (connection == null) {
            System.err.println("❌ Connexion null dans updatePerson");
            return false;
        }
        
        String sql = "UPDATE person SET name = ?, age = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, p.getName());
            pstmt.setInt(2, p.getAge());
            pstmt.setInt(3, p.getId());
            boolean updated = pstmt.executeUpdate() > 0;
            if (updated) {
                System.out.println("✅ Personne mise à jour ID: " + p.getId());
            } else {
                System.out.println("⚠️ Personne non trouvée pour mise à jour ID: " + p.getId());
            }
            return updated;
        } catch (SQLException e) {
            System.err.println("❌ Erreur updatePerson: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Crée la table 'person' si elle n'existe pas.
     */
    public void createTableIfNotExists() {
        if (connection == null) {
            System.err.println("❌ Connexion null, impossible de créer la table");
            return;
        }
        
        String sql = "CREATE TABLE IF NOT EXISTS person (" +
                     "id INT AUTO_INCREMENT PRIMARY KEY, " +
                     "name VARCHAR(100) NOT NULL, " +
                     "age INT NOT NULL" +
                     ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.executeUpdate();
            System.out.println("✅ Table 'person' créée ou déjà existante.");
            
            // Vérifier si la table est vide et insérer des données de test
            checkAndInsertTestData();
        } catch (SQLException e) {
            System.err.println("❌ Erreur createTableIfNotExists: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Insère des données de test si la table est vide.
     */
    private void checkAndInsertTestData() {
        try {
            String countSql = "SELECT COUNT(*) as count FROM person";
            PreparedStatement countStmt = connection.prepareStatement(countSql);
            ResultSet rs = countStmt.executeQuery();
            
            if (rs.next() && rs.getInt("count") == 0) {
                System.out.println("📝 Table vide, insertion de données de test...");
                
                String[] testNames = {"Jean Dupont", "Marie Curie", "Paul Martin", "Sophie Bernard"};
                int[] testAges = {30, 45, 28, 32};
                
                String insertSql = "INSERT INTO person (name, age) VALUES (?, ?)";
                PreparedStatement insertStmt = connection.prepareStatement(insertSql);
                
                for (int i = 0; i < testNames.length; i++) {
                    insertStmt.setString(1, testNames[i]);
                    insertStmt.setInt(2, testAges[i]);
                    insertStmt.addBatch();
                }
                
                insertStmt.executeBatch();
                System.out.println("✅ Données de test insérées");
            } else {
                System.out.println("📊 Table contient déjà " + rs.getInt("count") + " enregistrements");
            }
            
            rs.close();
            countStmt.close();
        } catch (SQLException e) {
            System.err.println("❌ Erreur lors de l'insertion des données test: " + e.getMessage());
        }
    }
}