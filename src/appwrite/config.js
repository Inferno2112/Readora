import { Client, ID , Databases , Query , Storage } from "appwrite";
import conf from "../conf/conf.js";

export class Service {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client
            .setEndpoint(conf.appwrite.url)
            .setProject(conf.appwrite.projectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage , status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                slug,{
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    } 

    async updatePost(slug,{ postId , title,  content, featuredImage , status}){
        try {
            return await this.databases.updateDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                slug,
                postId,{
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async getPosts(slug){
        try {
            return await this.databases.getDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                slug
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
        }
    }

    async getPosts(quries = [Query.equal('status','active')]){
        try {
            return await this.databases.listDocuments(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                quries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
        }
    }

    //file upload service
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwrite.bucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwrite.bucketId,
                fileId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwrite.bucketId,
            fileId
        );
    }
}

const service = new Service();
export default service;