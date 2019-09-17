import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInterfaceType,
    GraphQLEnumType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString
} from 'graphql';

import {makeExecutableSchema} from 'graphql-tools';

import {PubSub, SubscriptionManager, withFilter} from 'graphql-subscriptions';

const pubsub = new PubSub();
const add_review_topic = 'new_review';

const schemaString = `
    schema {
        query: Query,
        mutation: Mutation,
        subscription:Subscription
    }
    type Query {
        hero(episode:Episode): Character,
        reviews(episode:Episode):[Review],
        search(text: String):[SearchResult],
        character(id:ID):Character,
        droid(id:ID!):Droid,
        human(id:ID!):Human,
        starship(id:ID!):Starship
    }
    type Mutation {
        createReview(episode:Episode, review:ReviewInput):Review
    }
    
    type Subscription {
        reviewAdded(episode: Episode):Review
    }
    
    enum Episode {
        newhope,
        empire,
        jedi
    }
    
    interface Character {
        id:ID!
        name:String!
        friends:[Character],
        friendsConnection(first:Int, after:ID):FriendsConnection!
        appearsIn:[Episode]!
    }
    
    enum LengthUnit {
        meter
        foot
    }
    
    type Human implements Character {
        id: ID!
        name:String!
        homePlanet:String
        height(unit: LengthUnit=meter):Float
        mass: Float
        friends:[Character]
        frientsConnection(first:Int, after:ID): FriendsConnection!
        apperasIn:[Episode]!
        starships:[Starship]
    }
    
    type FriendsConnection {
        totalCount: Int,
        edges:[FriendsEdge],
        friends:[Character],
        pageInfo: PageInfo
    }
    
    type FriendsEdge {
        cursor: ID!,
        node: Character
    }
    
    type PageInfo {
        startCursor: ID,
        endCursor: ID,
        hasNextPage: Boolean!
    }
    
    type Review {
        episode: Episode
        stars: Int!
        commentary: String
    }
    
    input ReviewInput {
        stars: Int!
        commentary: String
        favoriter_color: ColorInput
    }
    
    input ColorInput {
        red: Int!
        green: Int!
        blue:Int!
    }
    
    type Starship {
        id: ID!
        name: String!
        length(unit: lengthUnit=meter):Float
        coordinates:[[Float!]]
    }
    
    union SearchResult = Human | Droid | Starship
    
`;