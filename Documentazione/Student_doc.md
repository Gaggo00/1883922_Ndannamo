# SYSTEM DESCRIPTION:

<system of the system>

# USER STORIES:

<list of user stories>


# CONTAINERS:

## CONTAINER_NAME: backend

### DESCRIPTION: 
<description of the container>

### USER STORIES:
<list of user stories satisfied>

### PORTS: 
- 8080

### DESCRIPTION:
<description of the container>

### PERSISTENCE EVALUATION
<description on the persistence of data>

### EXTERNAL SERVICES CONNECTIONS
<description on the connections to external services>

### MICROSERVICES:
- Authentication
- Profile managing
- Trips managing
- Trip schedule managing
- Trip expenses managing
- Trip photos managing

#### MICROSERVICE: Authentication
- TYPE: backend
- DESCRIPTION: <description of the microservice>
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION:
<description of the technological aspect of the microservice>
- SERVICE ARCHITECTURE: 
<description of the architecture of the microservice>

- ENDPOINTS: <put this bullet point only in the case of backend and fill the following table>
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | POST | /api/auth/login | Logs the user in, returning a JWT token | ... |
    | POST | /api/auth/register | Registers a user, returning a JWT token | ... |


- PAGES: <put this bullet point only in the case of frontend and fill the following table>

	| Name | Description | Related Microservice | User Stories |
	| ---- | ----------- | -------------------- | ------------ |
	| ... | ... | ... | ... |

- DB STRUCTURE: <put this bullet point only in the case a DB is used in the microservice and specify the structure of the tables and columns>

	**_<name of the table>_** :	| **_id_** | <other columns>


#### MICROSERVICE: Trips managing
- TYPE: backend
- DESCRIPTION: <description of the microservice>
- PORTS: 8080
- TECHNOLOGICAL SPECIFICATION:
<description of the technological aspect of the microservice>
- SERVICE ARCHITECTURE: 
<description of the architecture of the microservice>

- ENDPOINTS: <put this bullet point only in the case of backend and fill the following table>
		
	| HTTP METHOD | URL | Description | User Stories |
	| ----------- | --- | ----------- | ------------ |
    | POST | /trips | Creates a new trip | ... |
    | GET | /trips | Returns all trips of the logged user | ... |
    | GET | /trips/{id} | Returns trip {id} | ... |
    | DELETE | /trips/{id} | Deletes trip {id} | ... |
    | POST | /trips/{id}/invite | Invites users to trip {id} | ... |
    | DELETE | /trips/{id}/invite | Uninvites users to trip {id} | ... |
    | DELETE | /trips/{id}/participants | Removes users from trip {id} | ... |
    | GET | /trips/{id}/leave | Leaves trip {id} | ... |


- DB STRUCTURE: <put this bullet point only in the case a DB is used in the microservice and specify the structure of the tables and columns>

	**_trip_** : | **_id_** | creation_date | start_date | end_date | created_by | title | locations | invitations |

    **_trips\_invitations_** : | **_trip_id, user_id_** | - |



#### <other microservices>

## <other containers>

Student_doc.md
Visualizzazione di Student_doc.md.