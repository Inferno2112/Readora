import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(
        post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : null
    );
    const titleValue = watch("title") || "";
    const maxTitleLength = 200;

    // Update image preview when post changes (for edit mode)
    React.useEffect(() => {
        if (post?.featuredImage && !imagePreview) {
            setImagePreview(appwriteService.getFilePreview(post.featuredImage));
        }
    }, [post?.featuredImage]);

    const submit = async (data) => {
        setIsUploading(true);
        try {
            if (post) {
                // Edit mode
                let fileId = post.featuredImage; // Keep existing image by default
                
                // If new image is uploaded
                if (data.image && data.image[0]) {
                    const file = await appwriteService.uploadFile(data.image[0]);
                    if (file) {
                        // Delete old image if exists
                        if (post.featuredImage) {
                            appwriteService.deleteFile(post.featuredImage);
                        }
                        fileId = file.$id;
                    }
                } else if (!imagePreview && post.featuredImage) {
                    // Image was removed
                    appwriteService.deleteFile(post.featuredImage);
                    fileId = null;
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    featuredImage: fileId || undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // Create mode
                if (!data.image || !data.image[0]) {
                    alert("Please select an image for your post");
                    setIsUploading(false);
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    const dbPost = await appwriteService.createPost({
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        featuredImage: fileId,
                        status: data.status,
                        userId: userData.$id,
                        userName: userData.prefs?.username || userData.name || null,
                        userAvatarId: userData.prefs?.avatarId || null
                    });

                    if (dbPost) {
                        navigate(`/all-posts`);
                    }
                }
            }
        } catch (error) {
            console.error("Error uploading post:", error);
            alert("Failed to save post. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
            {/* User Avatar */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {(userData?.name || userData?.email || 'U').charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 space-y-4">
                    {/* Title Input */}
                    <div>
                        <textarea
                            {...register("title", { 
                                required: true,
                                maxLength: maxTitleLength
                            })}
                            placeholder="What's on your mind?"
                            className="w-full bg-transparent text-xl text-white placeholder-zinc-500 resize-none outline-none border-none focus:ring-0"
                            rows={3}
                            maxLength={maxTitleLength}
                        />
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-zinc-500">
                                {titleValue.length}/{maxTitleLength} characters
                            </p>
                        </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-96 object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Content Editor */}
                    <div className="border-t border-zinc-800 pt-4">
                        <RTE 
                            name="content" 
                            control={control} 
                            defaultValue={getValues("content")} 
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-4">
                            {/* Image Upload */}
                            <label className="cursor-pointer p-2 rounded-full hover:bg-blue-500/20 transition-colors group">
                                <input
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                    className="hidden"
                                    {...register("image", { required: !post && !imagePreview })}
                                    onChange={(e) => {
                                        handleImageChange(e);
                                        register("image").onChange(e);
                                    }}
                                />
                                <svg className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </label>

                            {/* Status Select */}
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-zinc-400">Status:</label>
                                <select
                                    {...register("status", { required: true })}
                                    className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/50"
                            disabled={isUploading || !titleValue.trim()}
                        >
                            {isUploading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                post ? "Update Post" : "Post"
                            )}
                        </Button>
                    </div>

                    {/* Hidden Slug Input (auto-generated) */}
                    <input type="hidden" {...register("slug", { required: true })} />
                </div>
            </div>
        </form>
    );
}