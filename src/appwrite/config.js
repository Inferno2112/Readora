import { Client, ID, Databases, Query, Storage } from "appwrite";
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

    async createPost({ title, slug, content, featuredImage, status, userId, userName, userAvatarId }) {
        try {
            const documentData = {
                title,
                content,
                featuredImage,
                status,
                userId: userId,
            };
            
            // Add username and avatarId if provided (these need to be in your Appwrite collection schema)
            if (userName) {
                documentData.userName = userName;
            }
            if (userAvatarId) {
                documentData.userAvatarId = userAvatarId;
            }
            
            return await this.databases.createDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                slug,
                documentData
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(documentId, data) {
        try {
            return await this.databases.updateDocument(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                documentId,
                data
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
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

    async getPost(slug) {
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

    async getPosts(quries = []) {
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

    /**
     * Get suggested users (unique authors from recent posts), excluding current user.
     * Returns array of { userId, userName, userAvatarId } for "Who to follow".
     */
    async getSuggestedUsers(currentUserId, limit = 5) {
        try {
            const res = await this.databases.listDocuments(
                conf.appwrite.databaseId,
                conf.appwrite.collectionId,
                [Query.orderDesc("$createdAt"), Query.limit(80)]
            );
            if (!res || !res.documents || !res.documents.length) return [];
            const byId = new Map();
            for (const doc of res.documents) {
                const id = doc.userId;
                if (!id || id === currentUserId) continue;
                if (!byId.has(id)) {
                    byId.set(id, {
                        userId: id,
                        userName: doc.userName || doc.name || null,
                        userAvatarId: doc.userAvatarId || null,
                    });
                }
            }
            return Array.from(byId.values()).slice(0, limit);
        } catch (error) {
            console.log("Appwrite service :: getSuggestedUsers :: error", error);
            return [];
        }
    }

    //file upload service
    async uploadFile(file) {
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

    async deleteFile(fileId) {
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

    /**
     * Returns a public file URL that works without authentication (incognito, other devices, localhost).
     * Requires the storage bucket to have "Read" permission for "Any" in Appwrite Console.
     */
    getFilePreview(fileId) {
        if (!fileId || !conf.appwrite.bucketId || !conf.appwrite.projectId) return '';
        const base = (conf.appwrite.url || '').replace(/\/$/, '').replace(/\/v1\/?$/, '');
        const projectId = conf.appwrite.projectId;
        const bucketId = conf.appwrite.bucketId;
        return `${base}/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
    }

    getFileView(fileId) {
        return this.bucket.getFileView(
            conf.appwrite.bucketId,
            fileId
        );
    }

    async getPostsByUser(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.error("Appwrite getPostsByUser error:", error);
            return null;
        }
    }


    async getMyPosts(userId) {
        return await this.getPosts([
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
        ]);
    }
    async getActivePosts() {
        return await this.getPosts([
            Query.equal("status", "active"),
            Query.orderDesc("$createdAt"),
        ]);
    }

    // Like functionality
    async likePost(postId, userId) {
        try {
            // TODO: Create likes collection in Appwrite
            // This would create/update a like document
            return true;
        } catch (error) {
            console.log("Appwrite service :: likePost :: error", error);
            return false;
        }
    }

    async unlikePost(postId, userId) {
        try {
            // TODO: Delete like document
            return true;
        } catch (error) {
            console.log("Appwrite service :: unlikePost :: error", error);
            return false;
        }
    }

    async getPostLikes(postId) {
        try {
            // TODO: Get likes count for a post
            return { count: 0, isLiked: false };
        } catch (error) {
            console.log("Appwrite service :: getPostLikes :: error", error);
            return { count: 0, isLiked: false };
        }
    }

    // Bookmark functionality
    async bookmarkPost(postId, userId) {
        try {
            // TODO: Create bookmarks collection in Appwrite
            return true;
        } catch (error) {
            console.log("Appwrite service :: bookmarkPost :: error", error);
            return false;
        }
    }

    async unbookmarkPost(postId, userId) {
        try {
            // TODO: Delete bookmark document
            return true;
        } catch (error) {
            console.log("Appwrite service :: unbookmarkPost :: error", error);
            return false;
        }
    }

    async getBookmarkedPosts(userId) {
        try {
            // TODO: Get all bookmarked posts for user
            return { documents: [] };
        } catch (error) {
            console.log("Appwrite service :: getBookmarkedPosts :: error", error);
            return { documents: [] };
        }
    }

    // Follow functionality
    async followUser(followerId, followingId) {
        try {
            // TODO: Create follows collection in Appwrite
            return true;
        } catch (error) {
            console.log("Appwrite service :: followUser :: error", error);
            return false;
        }
    }

    async unfollowUser(followerId, followingId) {
        try {
            // TODO: Delete follow document
            return true;
        } catch (error) {
            console.log("Appwrite service :: unfollowUser :: error", error);
            return false;
        }
    }

    async getFollowers(userId) {
        try {
            // TODO: Get followers count and list
            return { count: 0, followers: [] };
        } catch (error) {
            console.log("Appwrite service :: getFollowers :: error", error);
            return { count: 0, followers: [] };
        }
    }

    async getFollowing(userId) {
        try {
            // TODO: Get following count and list
            return { count: 0, following: [] };
        } catch (error) {
            console.log("Appwrite service :: getFollowing :: error", error);
            return { count: 0, following: [] };
        }
    }

    // Profile update
    async updateProfile(userId, data) {
        try {
            // TODO: Update user profile (name, avatar, banner)
            // This might require a users collection or updating account metadata
            return true;
        } catch (error) {
            console.log("Appwrite service :: updateProfile :: error", error);
            return false;
        }
    }

    // Comments functionality
    async addComment(postId, userId, content) {
        try {
            // TODO: Create comments collection in Appwrite
            return true;
        } catch (error) {
            console.log("Appwrite service :: addComment :: error", error);
            return false;
        }
    }

    async getComments(postId) {
        try {
            // TODO: Get all comments for a post
            return { documents: [] };
        } catch (error) {
            console.log("Appwrite service :: getComments :: error", error);
            return { documents: [] };
        }
    }

}

const service = new Service();
export default service;