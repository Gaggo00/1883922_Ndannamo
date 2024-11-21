********************* DEMO *********************

ISTRUZIONI PRESE DA QUI:
https://spring.io/guides/gs/spring-boot-docker


PROGETTO GENERATO DA: https://start.spring.io/
Con questi parametri:
	Project -> Maven
	Language -> Java
	Spring Boot -> 3.3.6
	Packaging -> Jar
	Dependencies -> Spring Web


STEP PER AVVIARLO:

1) spostati dentro la cartella demo

>> cd C:\Users\annac\Documents\GitHub\do_Annamo_project\demo


2) build (e avvia direttamente) tramite maven (ovvero crea un pacchetto jar con l'applicazione e tutte le librerie e dipendenze che servono):

>> mvnw package && java -jar target/demo-0.0.1-SNAPSHOT.jar

Testa se funziona andando su localhost:8080


3) crea immagine docker

>> docker build -t dannamo/demo .


4) run immagine docker

>> docker run -p 5000:8080 dannamo/demo

(mappa la porta 8080 del container alla porta 5000 di localhost, quindi ora l'applicazione si apre andando a localhost:5000)





********************* DATABASE POSTGRES *********************

Generato pullando un'immagine docker ufficiale di postgres, e avviando un container. Tutto questo viene fatto nel file compose.yml, dove vengono settate le variabili d'ambiente POSTGRES_USER e POSTGRES_PASSWORD.

Sempre nel compose, carico come volume lo script create_database.sql, che contiene dei comandi SQL per creare il database "dannamo_db" e crearci la tabella users. (NON FUNZIONA, IL DB VIENE CREATO MA LA TABELLA NO)

Poi dalla cartella do_Annamo_project avvia tutto con:

>> docker compose up -d 

Da Docker Desktop, trova il container del database e aprici un terminale (pulsante CLI in alto a destra), e fai:
>> psql -U myuser -d dannamo_db
e poi vedi che tabelle ci sono facendo:
>> \c dannamo_db
>> \dt










********************* DATABASE (no) *********************

PROGETTO GENERATO DA: https://start.spring.io/
Con questi parametri:
	Project -> Maven
	Language -> Java
	Spring Boot -> 3.3.6
	Packaging -> Jar
	Dependencies -> Spring Web, Spring Data JPA, PostgreSQL Driver

ISTRUZIONI (poco) seguite:
https://hackernoon.com/using-postgres-effectively-in-spring-boot-applications




