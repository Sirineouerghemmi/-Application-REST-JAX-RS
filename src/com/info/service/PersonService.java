package com.info.service;

import com.info.model.Person;

public interface PersonService {

	/**
	 * Ajoute une personne.
	 * @param p La personne à ajouter.
	 * @return true si succès, false sinon.
	 */
	public boolean addPerson(Person p);

	/**
	 * Supprime une personne par ID.
	 * @param id L'ID de la personne.
	 * @return true si succès, false sinon.
	 */
	public boolean deletePerson(int id);

	/**
	 * Récupère une personne par nom.
	 * @param name Le nom.
	 * @return La personne ou null si non trouvée.
	 */
	public Person getPersonByName(String name);

	/**
	 * Récupère une personne par ID.
	 * @param id L'ID.
	 * @return La personne ou null si non trouvée.
	 */
	public Person getPerson(int id);

	/**
	 * Récupère toutes les personnes.
	 * @return Tableau de personnes (vide si aucune).
	 */
	public Person[] getAllPersons();

	/**
	 * Met à jour une personne.
	 * @param p La personne mise à jour.
	 * @return true si succès, false sinon.
	 */
	public boolean updatePerson(Person p);
}