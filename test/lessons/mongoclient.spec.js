import { MongoClient } from "mongodb";

describe("MongoClient", () => {
 

  test("Client initialized with URI", async () => {
   
    try {

        const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })
      expect(testClient).not.toBeNull()

      // retrieve client options
      const clientOptions = testClient.s.options


      // ADDED BY ME
      expect(clientOptions.ssl).toBe(true)

      expect(clientOptions.user).toBe("foo")

      expect(clientOptions.authSource).toBe("admin")


      // expect this connection to have SSL enabled
      /*if (typeof clientOptions.ssl !== "undefined") {
        expect(clientOptions).toHaveProperty("ssl")
        expect(clientOptions.ssl).toBe(true)

        expect(clientOptions.user).toBe("foo")

        // expect this user to authenticate against the "admin" database
        expect(clientOptions).toHaveProperty("authSource")
        expect(clientOptions.authSource).toBe("admin")
      }
      */
    } catch (e) {
      expect(e).toBeNull()
    } finally {

      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })

      testClient.close()
    }
    
  })

  test("Client initialized with URI and options", async () => {
   
    try {
      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        connectTimeoutMS: 200,
        retryWrites: true,
        useNewUrlParser: true,
      })

      const clientOptions = testClient.s.options

      // expect clientOptions to have the correct settings
      expect(clientOptions.connectTimeoutMS).toBe(200)
      expect(clientOptions.retryWrites).toBe(true)
      expect(clientOptions.useNewUrlParser).toBe(true)
    } catch (e) {
      expect(e).toBeNull()
      
    } finally {

      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })

      testClient.close()
    }
  })

  test("Database handle created from MongoClient", async () => {
 

    try {
      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })

      // create a database object for the "mflix" database
      const mflixDB = testClient.db("sample_mflix")

      // make sure the "mflix" database has the correct collections
      const mflixCollections = await mflixDB.listCollections().toArray()
      const actualCollectionNames = mflixCollections.map(obj => obj.name)
      const expectedCollectionNames = [
        "movies",
        "users",
        "comments",
        "sessions",
      ]
      expectedCollectionNames.map(collection => {
        expect(actualCollectionNames).toContain(collection)
      })
    } catch (e) {
      expect(e).toBeNull()
      
    } finally {

      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })

      testClient.close()
    }
  })

  test("Collection handle created from database handle", async () => {
 

    try {
      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        connectTimeoutMS: 200,
        retryWrites: true,
        useNewUrlParser: true,
      })

      // create a database object for the "mflix" database
      const mflixDB = testClient.db("sample_mflix")

      // create a collection object for the "movies" collection
      const movies = mflixDB.collection("movies")

      // expect the "movies" collection to have the correct number of movies
      const numMoves = await movies.countDocuments({})
      expect(numMoves).toBe(23539)
    } catch (e) {
      expect(e).toBeNull()
    } finally {

      const testClient = await MongoClient.connect(process.env.MFLIX_DB_URI, {
        useNewUrlParser: true,
      })


      testClient.close()
    }
  })
})