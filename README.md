ISTRUZIONI PRESE DA QUI:
https://spring.io/guides/gs/spring-boot-docker


STEP:

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






