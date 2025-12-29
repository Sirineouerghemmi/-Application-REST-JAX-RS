package com.info.model;

public class Person {
	
	private String name;
	private int age;
	private int id;
	
	/**
	 * Constructeur par défaut.
	 */
	public Person() {}
	
	/**
	 * Constructeur avec paramètres.
	 * @param id ID de la personne.
	 * @param name Nom de la personne.
	 * @param age Âge de la personne.
	 */
	public Person(int id, String name, int age) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
	
	/**
	 * @return Le nom de la personne.
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Définit le nom de la personne.
	 * @param name Le nom.
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return L'âge de la personne.
	 */
	public int getAge() {
		return age;
	}
	
	/**
	 * Définit l'âge de la personne.
	 * @param age L'âge.
	 */
	public void setAge(int age) {
		this.age = age;
	}
	
	/**
	 * @return L'ID de la personne.
	 */
	public int getId() {
		return id;
	}
	
	/**
	 * Définit l'ID de la personne.
	 * @param id L'ID.
	 */
	public void setId(int id) {
		this.id = id;
	}
	
	@Override
	public String toString() {
		return "Person [id=" + id + ", name=" + name + ", age=" + age + "]";
	}
}