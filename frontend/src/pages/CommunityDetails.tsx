import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  getCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityPosts,
  createCommunityPost,
  likeCommunityPost,
  unlikeCommunityPost,
  getCommunityPostComments,
  createCommunityPostComment,
} from "../api/communities";


// =========================================================
// Types
// =========================================================

interface Member {
  id: number;
  name: string;
}

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  joined: boolean;
  created_by: number;
  member_list: Member[];
}

interface CommunityPost {
  id: number;
  content: string;
  user_id: number;
  user_name: string;
  community_id: number;
  likes: number;
  liked_by_current_user: boolean;
  comments: number;
}

interface CommunityComment {
  id: number;
  community_post_id: number;
  user_id: number;
  author: string;
  content: string;
  created_at: string;
}


// =========================================================
// Community Colors
// =========================================================

const communityColors: Record<string, string> = {
  Study: "bg-[#E9E3FF]",
  Creative: "bg-[#FDE2E4]",
  Activities: "bg-[#DFF3EA]",
  Technology: "bg-[#DDEBFA]",
  Hobbies: "bg-[#FFF0D8]",
};


// =========================================================
// Community Icons
// =========================================================

const communityIcons: Record<string, string> = {
  Study: "✦",
  Creative: "✎",
  Activities: "♡",
  Technology: "</>",
  Hobbies: "B",
};


// =========================================================
// Component
// =========================================================

function CommunityDetails() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  // -------------------------------------------------------
  // Community state
  // -------------------------------------------------------

  const [community, setCommunity] =
    useState<Community | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updating, setUpdating] =
    useState(false);


  // -------------------------------------------------------
  // Posts state
  // -------------------------------------------------------

  const [posts, setPosts] =
    useState<CommunityPost[]>([]);

  const [postsLoading, setPostsLoading] =
    useState(true);

  const [postContent, setPostContent] =
    useState("");

  const [creatingPost, setCreatingPost] =
    useState(false);

  const [postError, setPostError] =
    useState("");

const [commentOpen, setCommentOpen] =
  useState<number | null>(null);

const [comments, setComments] =
  useState<Record<number, CommunityComment[]>>({});

const [commentsLoading, setCommentsLoading] =
  useState<number | null>(null);

const [commentContent, setCommentContent] =
  useState<Record<number, string>>({});

const [commentSubmitting, setCommentSubmitting] =
  useState<number | null>(null);

const [likingPost, setLikingPost] =
  useState<number | null>(null);    


  // =======================================================
  // Load Community
  // =======================================================

  async function loadCommunity() {
    if (!communityId) {
      setError("Community not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getCommunity(
        Number(communityId)
      );

      setCommunity({
        ...data,
        member_list: data.member_list || [],
      });

    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load community"
      );
    } finally {
      setLoading(false);
    }
  }


  // =======================================================
  // Load Community Posts
  // =======================================================

  async function loadPosts() {
    if (!communityId) {
      return;
    }

    try {
      setPostsLoading(true);
      setPostError("");

      const data = await getCommunityPosts(
        Number(communityId)
      );

      setPosts(data || []);

    } catch (error: any) {
      setPostError(
        error.response?.data?.detail ||
          "Unable to load community posts"
      );
    } finally {
      setPostsLoading(false);
    }
  }


  // =======================================================
  // Initial Load
  // =======================================================

  useEffect(() => {
    loadCommunity();
    loadPosts();
  }, [communityId]);


  // =======================================================
  // Join / Leave Community
  // =======================================================

  async function handleJoinLeave() {
    if (!community || updating) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      let response;

      if (community.joined) {
        response = await leaveCommunity(
          community.id
        );
      } else {
        response = await joinCommunity(
          community.id
        );
      }

      setCommunity((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          joined: response.joined,
          members: response.members,
        };
      });

    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to update community"
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleLike(post: CommunityPost) {
  if (!community || likingPost === post.id) {
    return;
  }

  try {
    setLikingPost(post.id);

    const response = post.liked_by_current_user
      ? await unlikeCommunityPost(
          community.id,
          post.id
        )
      : await likeCommunityPost(
          community.id,
          post.id
        );

    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              likes: response.likes,
              liked_by_current_user: response.liked,
            }
          : item
      )
    );
  } catch (error: any) {
    setPostError(
      error.response?.data?.detail ||
        "Unable to update like"
    );
  } finally {
    setLikingPost(null);
  }
}

async function handleToggleComments(
  post: CommunityPost
) {
  if (!community) {
    return;
  }

  if (commentOpen === post.id) {
    setCommentOpen(null);
    return;
  }

  try {
    setCommentOpen(post.id);
    setCommentsLoading(post.id);

    const data =
      await getCommunityPostComments(
        community.id,
        post.id
      );

    setComments((current) => ({
      ...current,
      [post.id]: data || [],
    }));
  } catch (error: any) {
    setPostError(
      error.response?.data?.detail ||
        "Unable to load comments"
    );
  } finally {
    setCommentsLoading(null);
  }
}

async function handleCreateComment(
  post: CommunityPost
) {
  if (!community || commentSubmitting === post.id) {
    return;
  }

  const content =
    commentContent[post.id]?.trim() || "";

  if (!content) {
    setPostError("Comment cannot be empty");
    return;
  }

  try {
    setCommentSubmitting(post.id);
    setPostError("");

    const response =
      await createCommunityPostComment(
        community.id,
        post.id,
        content
      );

    const newComment =
      response.comment;

    setComments((current) => ({
      ...current,
      [post.id]: [
        ...(current[post.id] || []),
        newComment,
      ],
    }));

    setCommentContent((current) => ({
      ...current,
      [post.id]: "",
    }));

    setPosts((currentPosts) =>
      currentPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              comments: item.comments + 1,
            }
          : item
      )
    );
  } catch (error: any) {
    setPostError(
      error.response?.data?.detail ||
        "Unable to add comment"
    );
  } finally {
    setCommentSubmitting(null);
  }
}


  // =======================================================
  // Create Community Post
  // =======================================================

  async function handleCreatePost() {
    if (!community || creatingPost) {
      return;
    }

    const content = postContent.trim();

    if (!content) {
      setPostError("Post content cannot be empty");
      return;
    }

    try {
      setCreatingPost(true);
      setPostError("");

      const newPost =
        await createCommunityPost(
          community.id,
          content
        );

      setPosts((currentPosts) => [
        newPost,
        ...currentPosts,
      ]);

      setPostContent("");

    } catch (error: any) {
      setPostError(
        error.response?.data?.detail ||
          "Unable to create post"
      );
    } finally {
      setCreatingPost(false);
    }
  }


  // =======================================================
  // Loading Screen
  // =======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] px-5 py-10">
        <div className="mx-auto max-w-5xl">

          <div className="h-6 w-40 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 h-72 animate-pulse rounded-[2rem] bg-white" />

          <div className="mt-6 h-48 animate-pulse rounded-3xl bg-white" />

        </div>
      </main>
    );
  }


  // =======================================================
  // Error / Not Found
  // =======================================================

  if (error || !community) {
    return (
      <main className="min-h-screen bg-[#F8F7F4] px-5 py-10">

        <div className="mx-auto max-w-5xl">

          <button
            onClick={() => navigate("/explore")}
            className="mb-6 text-sm font-semibold text-slate-500 transition hover:text-[#7B61D9]"
          >
            ← Back to Communities
          </button>

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              {error || "Community not found"}
            </h2>

          </div>

        </div>

      </main>
    );
  }


  // =======================================================
  // Community Styling
  // =======================================================

  const background =
    communityColors[community.category] ||
    "bg-[#E9E3FF]";

  const icon =
    communityIcons[community.category] ||
    "✦";


  // =======================================================
  // Render
  // =======================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7F4]">

      {/* =================================================
          Background Decoration
      ================================================= */}

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-32 h-72 w-72 rounded-full bg-[#DFF3EA] opacity-70 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-100px] top-20 h-80 w-80 rounded-full bg-[#FDE2E4] opacity-60 blur-3xl"
      />


      <div className="relative mx-auto max-w-5xl px-5 py-10 sm:px-8">

        {/* =================================================
            Back Button
        ================================================= */}

        <button
          onClick={() => navigate("/explore")}
          className="mb-6 text-sm font-semibold text-slate-500 transition hover:text-[#7B61D9]"
        >
          ← Back to Communities
        </button>


        {/* =================================================
            Hero
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className={`relative overflow-hidden rounded-[2rem] ${background} p-8 sm:p-10`}
        >

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40" />

          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/30" />


          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            {/* Community information */}

            <div className="flex items-center gap-5">

              <motion.div
                whileHover={{
                  rotate: 6,
                  scale: 1.05,
                }}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.8rem] bg-white text-4xl font-bold text-[#7055D6] shadow-sm"
              >
                {icon}
              </motion.div>


              <div>

                <span className="text-xs font-bold uppercase tracking-widest text-[#7055D6]">
                  {community.category}
                </span>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {community.name}
                </h1>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {community.members} members
                </p>

              </div>

            </div>


            {/* Join / Leave */}

            <motion.button
              whileTap={{
                scale: 0.96,
              }}
              disabled={updating}
              onClick={handleJoinLeave}
              className={`rounded-2xl px-7 py-3 text-sm font-bold transition ${
                community.joined
                  ? "bg-white text-[#36856A] shadow-sm hover:bg-[#F4FFFA]"
                  : "bg-[#7B61D9] text-white shadow-md shadow-[#DCD4FA] hover:bg-[#6B52C8]"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updating
                ? "Please wait..."
                : community.joined
                  ? "Joined"
                  : "Join Community"}
            </motion.button>

          </div>

        </motion.section>


        {/* =================================================
            Community Error
        ================================================= */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600"
          >
            {error}
          </motion.div>
        )}


        {/* =================================================
            About + Stats
        ================================================= */}

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {/* About */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="rounded-3xl bg-white p-7 shadow-sm md:col-span-2"
          >

            <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
              About
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              About this community
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {community.description}
            </p>

          </motion.section>


          {/* Stats */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className="rounded-3xl bg-white p-7 shadow-sm"
          >

            <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
              Community
            </p>

            <div className="mt-5 space-y-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Category
                </p>

                <p className="mt-1 font-semibold text-[#7B61D9]">
                  {community.category}
                </p>

              </div>


              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Members
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {community.members}
                </p>

              </div>

            </div>

          </motion.section>

        </div>


        {/* =================================================
            Community Posts
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-6 rounded-3xl bg-white p-7 shadow-sm"
        >

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
              Community Feed
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Community Posts
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Share something with the members of this community.
            </p>

          </div>


          {/* =================================================
              Create Post
          ================================================= */}

          {community.joined ? (

            <div className="mt-6">

              <textarea
                value={postContent}
                onChange={(event) =>
                  setPostContent(event.target.value)
                }
                placeholder="Write something for the community..."
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-[#F8F7F4] px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#B8A9EE] focus:ring-2 focus:ring-[#E9E3FF]"
              />

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-400">
                  {postContent.length}/2000
                </p>

                <button
                  onClick={handleCreatePost}
                  disabled={
                    creatingPost ||
                    !postContent.trim()
                  }
                  className="rounded-2xl bg-[#7B61D9] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#DCD4FA] transition hover:bg-[#6B52C8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creatingPost
                    ? "Posting..."
                    : "Create Post"}
                </button>

              </div>

            </div>

          ) : (

            <div className="mt-6 rounded-2xl bg-[#F8F7F4] p-5 text-center">

              <p className="text-sm font-medium text-slate-500">
                Join this community to create a post.
              </p>

            </div>

          )}


          {/* =================================================
              Post Error
          ================================================= */}

          {postError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {postError}
            </div>
          )}


          {/* =================================================
              Posts
          ================================================= */}

          <div className="mt-8">

            {postsLoading ? (

              <div className="space-y-4">

                <div className="h-32 animate-pulse rounded-2xl bg-[#F8F7F4]" />

                <div className="h-32 animate-pulse rounded-2xl bg-[#F8F7F4]" />

              </div>

            ) : posts.length > 0 ? (

              <div className="space-y-4">

                {posts.map((post) => (

                  <motion.article
  key={post.id}
  initial={{
    opacity: 0,
    y: 10,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  className="rounded-2xl bg-[#F8F7F4] p-5"
>
  {/* Post Author */}

  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCD4FA] text-sm font-bold text-[#7055D6]">
      {post.user_name
        .charAt(0)
        .toUpperCase()}
    </div>

    <div>

      <p className="text-sm font-bold text-slate-800">
        {post.user_name}
      </p>

      <p className="text-xs text-slate-400">
        Community member
      </p>

    </div>

  </div>


  {/* Post Content */}

  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
    {post.content}
  </p>


  {/* Like / Comment Actions */}

  <div className="mt-5 flex items-center gap-3">

    <button
      onClick={() => handleLike(post)}
      disabled={likingPost === post.id}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        post.liked_by_current_user
          ? "bg-[#FDE2E4] text-[#C85B6B]"
          : "bg-white text-slate-500 hover:bg-[#FDE2E4] hover:text-[#C85B6B]"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {post.liked_by_current_user
        ? "♥"
        : "♡"}{" "}
      {post.likes}
    </button>


    <button
      onClick={() =>
        handleToggleComments(post)
      }
      className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-[#E9E3FF] hover:text-[#7055D6]"
    >
      💬 {post.comments}
    </button>

  </div>


  {/* Comments */}

  {commentOpen === post.id && (

    <div className="mt-5 border-t border-slate-200 pt-5">

      {commentsLoading === post.id ? (

        <div className="space-y-3">

          <div className="h-12 animate-pulse rounded-xl bg-white" />

          <div className="h-12 animate-pulse rounded-xl bg-white" />

        </div>

      ) : (

        <>
          {/* Existing Comments */}

          {(comments[post.id] || []).length > 0 ? (

            <div className="space-y-3">

              {comments[post.id].map(
                (comment) => (

                  <div
                    key={comment.id}
                    className="rounded-xl bg-white p-4"
                  >

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E9E3FF] text-xs font-bold text-[#7055D6]">
                        {comment.author
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <p className="text-xs font-bold text-slate-700">
                        {comment.author}
                      </p>

                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {comment.content}
                    </p>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="text-center text-xs font-medium text-slate-400">
              No comments yet. Start the conversation.
            </p>

          )}


          {/* Add Comment */}

          {community.joined && (

            <div className="mt-4">

              <div className="flex flex-col gap-2 sm:flex-row">

                <input
                  value={
                    commentContent[post.id] || ""
                  }
                  onChange={(event) =>
                    setCommentContent(
                      (current) => ({
                        ...current,
                        [post.id]:
                          event.target.value,
                      })
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();

                      handleCreateComment(
                        post
                      );
                    }
                  }}
                  maxLength={1000}
                  placeholder="Write a comment..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#B8A9EE] focus:ring-2 focus:ring-[#E9E3FF]"
                />

                <button
                  onClick={() =>
                    handleCreateComment(post)
                  }
                  disabled={
                    commentSubmitting === post.id ||
                    !(commentContent[post.id] || "").trim()
                  }
                  className="rounded-xl bg-[#7B61D9] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#6B52C8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {commentSubmitting === post.id
                    ? "Posting..."
                    : "Comment"}
                </button>

              </div>

            </div>

          )}

        </>

      )}

    </div>

  )}

</motion.article>

                ))}

              </div>

            ) : (

              <div className="rounded-2xl bg-[#F8F7F4] p-8 text-center">

                <p className="text-sm font-semibold text-slate-600">
                  No posts yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Be the first person to start the conversation.
                </p>

              </div>

            )}

          </div>

        </motion.section>


        {/* =================================================
            Members
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.25,
          }}
          className="mt-6 rounded-3xl bg-white p-7 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
                Community
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Members
              </h2>

            </div>

            <span className="rounded-full bg-[#F0ECFF] px-4 py-2 text-xs font-bold text-[#7055D6]">
              {community.member_list.length}
            </span>

          </div>


          {/* Member list */}

          {community.member_list.length > 0 ? (

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              {community.member_list.map(
                (member) => (

                  <motion.div
                    key={member.id}
                    whileHover={{
                      y: -2,
                    }}
                    className="flex items-center gap-3 rounded-2xl bg-[#F8F7F4] p-3 transition"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCD4FA] text-sm font-bold text-[#7055D6]">
                      {member.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {member.name}
                    </p>

                  </motion.div>

                )
              )}

            </div>

          ) : (

            <div className="mt-6 rounded-2xl bg-[#F8F7F4] p-6 text-center">

              <p className="text-sm font-medium text-slate-500">
                No members found.
              </p>

            </div>

          )}

        </motion.section>

      </div>

    </main>
  );
}


export default CommunityDetails;