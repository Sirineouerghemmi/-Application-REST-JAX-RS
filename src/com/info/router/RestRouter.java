package com.info.router;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.info.db.ConnexionDB;
import com.info.model.Person;
import com.info.service.PersonServiceImpl;

@Path("/persons")
public class RestRouter {

    private PersonServiceImpl personService;

    /**
     * Constructeur : Initialise le service et la table BD.
     */
    public RestRouter() {
        personService = new PersonServiceImpl();
        personService.createTableIfNotExists();
    }

    // GET health check
    @GET
    @Path("/health")
    @Produces(MediaType.APPLICATION_JSON)
    public Response healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", new Date());
        response.put("service", "Person API");
        response.put("version", "1.0");
        
        // Tester la connexion à la base de données
        try {
            boolean dbConnected = ConnexionDB.testConnexion();
            response.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");
        } catch (Exception e) {
            response.put("database", "ERROR: " + e.getMessage());
        }
        
        return Response.ok(response).build();
    }

    // GET all persons
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPersons() {
        Person[] persons = personService.getAllPersons();
        if (persons == null) {
            persons = new Person[0];
        }
        return Response.ok(persons).build();
    }

    // GET person by ID
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonById(@PathParam("id") int id) {
        Person person = personService.getPerson(id);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Personne non trouvée").build();
        }
        return Response.ok(person).build();
    }

    // GET person by name
    @GET
    @Path("/search/{name}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonByName(@PathParam("name") String name) {
        Person person = personService.getPersonByName(name);
        if (person == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("Personne non trouvée").build();
        }
        return Response.ok(person).build();
    }

    // POST add person
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addPerson(Person person) {
        if (person == null || person.getName() == null || person.getAge() <= 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Données invalides").build();
        }
        boolean added = personService.addPerson(person);
        if (added) {
            return Response.status(Response.Status.CREATED).entity(person).build();
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Échec ajout").build();
    }

    // PUT update person
    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePerson(Person person) {
        if (person == null || person.getId() <= 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity("ID invalide").build();
        }
        boolean updated = personService.updatePerson(person);
        if (updated) {
            return Response.ok(person).build();
        }
        return Response.status(Response.Status.NOT_FOUND).entity("Personne non trouvée").build();
    }

    // DELETE person by ID
    @DELETE
    @Path("/delete/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePerson(@PathParam("id") int id) {
        boolean deleted = personService.deletePerson(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Personne supprimée");
            return Response.ok(response).build();
        }
        return Response.status(Response.Status.NOT_FOUND).entity("Personne non trouvée").build();
    }
}