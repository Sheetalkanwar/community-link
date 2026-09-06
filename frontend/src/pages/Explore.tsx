import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  getPosts,
  createPost,
  likePost,
  unlikePost,
  getComments,
  createComment,
} from "../api/posts";

interface Post {
  id: number;
  type: string;
  title: string;
  description: string;
  user_id: number;
  author: string;
  likes: number;
  liked_by_current_user: boolean;
}

interface Comment {
  id: number;
  user_id: number;
  author: string;
  content: string;
}

const postTypes = [
  "All",
  "Need Help",
  "Offer Help",
  "Study",
  "Lost & Found",
  "Buy & Sell",
  "Activities",
];

const typeStyles: Record<string, string> = {
  "Need Help":
    "bg-[#FDE2E4] text-[#D95D72]",

  "Offer Help":
    "bg-[#DFF3EA] text-[#36856A]",

  Study:
    "bg-[#E9E3FF] text-[#7055D6]",

  "Lost & Found":
    "bg-[#FFF0D8] text-[#C98228]",

  "Buy & Sell":
    "bg-[#DDEBFA] text-[#4676A8]",

  Activities:
    "bg-[#F4E1F4] text-[#A052A0]",
};

function Explore() {
  const [posts, setPosts] =
    useState<Post[]>([]);

  /*
   * selectedType controls the feed filter.
   */
  const [selectedType, setSelectedType] =
    useState("All");

  /*
   * type controls the type of post
   * being created.
   */
  const [type, setType] =
    useState("Need Help");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [likingId, setLikingId] =
    useState<number | null>(null);

  const [openComments, setOpenComments] =
    useState<number | null>(null);

  const [comments, setComments] =
    useState<Record<number, Comment[]>>({});

  const [commentText, setCommentText] =
    useState("");

  const [commenting, setCommenting] =
    useState(false);

  /*
   * Load posts
   */
  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const data = await getPosts();

      setPosts(data);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load posts"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  /*
   * Create post
   */
  async function handleCreatePost() {
    if (
      !title.trim() ||
      !description.trim()
    ) {
      setMessage(
        "Title and description are required"
      );

      return;
    }

    try {
      setCreating(true);
      setMessage("");
      setError("");

      await createPost(
        type,
        title.trim(),
        description.trim()
      );

      setTitle("");
      setDescription("");

      setMessage(
        "Your post is now live."
      );

      await loadPosts();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Unable to create post"
      );
    } finally {
      setCreating(false);
    }
  }

  /*
   * Like / unlike post
   */
  async function handleLikePost(
    postId: number,
    currentlyLiked: boolean
  ) {
    try {
      setLikingId(postId);

      if (currentlyLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          return {
            ...post,

            likes: currentlyLiked
              ? Math.max(0, post.likes - 1)
              : post.likes + 1,

            liked_by_current_user:
              !currentlyLiked,
          };
        })
      );
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to update like"
      );
    } finally {
      setLikingId(null);
    }
  }

  /*
   * Open / close comments
   */
  async function handleComments(
    postId: number
  ) {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }

    try {
      const data =
        await getComments(postId);

      setComments((current) => ({
        ...current,
        [postId]: data,
      }));

      setOpenComments(postId);
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to load comments"
      );
    }
  }

  /*
   * Create comment
   */
  async function handleCreateComment(
    postId: number
  ) {
    if (!commentText.trim()) {
      return;
    }

    try {
      setCommenting(true);

      const data =
        await createComment(
          postId,
          commentText.trim()
        );

      setComments((current) => ({
        ...current,

        [postId]: [
          ...(current[postId] || []),
          data,
        ],
      }));

      setCommentText("");
    } catch (error: any) {
      setError(
        error.response?.data?.detail ||
          "Unable to add comment"
      );
    } finally {
      setCommenting(false);
    }
  }

  /*
   * Filter posts
   */
  const filteredPosts =
    selectedType === "All"
      ? posts
      : posts.filter(
          (post) =>
            post.type === selectedType
        );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F7F4]">

      {/* ================================================= */}
      {/* DECORATIVE BACKGROUND */}
      {/* ================================================= */}

      <motion.div
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#DDF0E8] opacity-70 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-[-100px] top-72 h-72 w-72 rounded-full bg-[#F7D8DE] opacity-60 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

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
          className="mb-8"
        >
          <div className="max-w-3xl">

            <span className="inline-flex rounded-full bg-[#E9E3FF] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#7055D6]">
              Your community, your space
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              What's happening
              <br />

              <span className="text-[#7B61D9]">
                around you?
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Discover people, ideas, activities and
              opportunities in your local community.
            </p>

          </div>
        </motion.section>

        {/* ================================================= */}
        {/* CATEGORY FILTERS */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-8 flex gap-2 overflow-x-auto pb-2"
        >
          {postTypes.map((postType) => {
            const active =
              selectedType === postType;

            return (
              <motion.button
                key={postType}
                type="button"
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => {

                  /*
                   * Change feed filter.
                   */
                  setSelectedType(postType);

                  /*
                   * If a real post category is
                   * selected, automatically
                   * update the Share Something
                   * dropdown as well.
                   */
                  if (postType !== "All") {
                    setType(postType);
                  }

                }}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-[#7B61D9] text-white shadow-md shadow-[#DCD4FA]"
                    : "bg-white text-slate-600 shadow-sm hover:bg-[#F0ECFF] hover:text-[#7055D6]"
                }`}
              >
                {postType}
              </motion.button>
            );
          })}
        </motion.div>

        {/* ================================================= */}
        {/* CREATE POST */}
        {/* ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.15,
          }}
          className="mb-10 overflow-hidden rounded-3xl border border-white bg-white shadow-sm"
        >
          <div className="grid lg:grid-cols-[1fr_260px]">

            {/* Composer */}

            <div className="p-6 sm:p-8">

              <div className="flex items-start gap-4">

                <motion.div
                  animate={{
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FDE2E4] text-xl"
                >
                  +
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Share something
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ask for help, offer something,
                    or start a conversation.
                  </p>
                </div>

              </div>

              <div className="mt-7 space-y-4">

                {/* ================================================= */}
                {/* TYPE SELECT */}
                {/* ================================================= */}

                <select
                  value={type}
                  onChange={(e) => {

                    const newType =
                      e.target.value;

                    /*
                     * Update the type used
                     * when creating the post.
                     */
                    setType(newType);

                    /*
                     * Also update the active
                     * feed category.
                     */
                    setSelectedType(newType);

                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-[#FAFAFA] px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#7B61D9] focus:ring-4 focus:ring-[#E9E3FF]"
                >
                  {postTypes
                    .filter(
                      (item) =>
                        item !== "All"
                    )
                    .map((postType) => (
                      <option
                        key={postType}
                        value={postType}
                      >
                        {postType}
                      </option>
                    ))}
                </select>

                {/* ================================================= */}
                {/* TITLE */}
                {/* ================================================= */}

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Give your post a title..."
                  className="w-full rounded-2xl border border-slate-200 bg-[#FAFAFA] px-4 py-3.5 text-sm outline-none transition focus:border-[#7B61D9] focus:ring-4 focus:ring-[#E9E3FF]"
                />

                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Tell your community what's on your mind..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-[#FAFAFA] px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-[#7B61D9] focus:ring-4 focus:ring-[#E9E3FF]"
                />

                <div className="flex flex-wrap items-center justify-between gap-4">

                  <button
                    type="button"
                    onClick={
                      handleCreatePost
                    }
                    disabled={creating}
                    className="rounded-2xl bg-[#7B61D9] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#DCD4FA] transition hover:-translate-y-0.5 hover:bg-[#6B52C8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating
                      ? "Posting..."
                      : "Publish Post"}
                  </button>

                  {message && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        x: 10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      className="text-sm text-slate-500"
                    >
                      {message}
                    </motion.p>
                  )}

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* SIDE VISUAL */}
            {/* ================================================= */}

            <div className="relative hidden overflow-hidden bg-[#E9E3FF] lg:block">

              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-12 top-12 h-28 w-28 rounded-[2rem] bg-[#F7B8C3]"
              />

              <motion.div
                animate={{
                  y: [0, 14, 0],
                  rotate: [0, -4, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-14 right-10 h-36 w-36 rounded-full bg-[#BFE3D5]"
              />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-6xl">
                    ✦
                  </div>

                  <p className="mt-4 max-w-[170px] text-sm font-semibold leading-6 text-[#6652A5]">
                    Small posts can create
                    big connections.
                  </p>

                </div>

              </div>

            </div>

          </div>
        </motion.section>

        {/* ================================================= */}
        {/* POSTS HEADER */}
        {/* ================================================= */}

        <div className="mb-5 flex items-end justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-[#7B61D9]">
              Community feed
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Latest posts
            </h2>

          </div>

          <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            {filteredPosts.length} posts
          </span>

        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

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
            className="mb-5 rounded-2xl bg-[#FDE2E4] p-4 text-sm font-medium text-[#C94D64]"
          >
            {error}
          </motion.div>
        )}

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">

            {[1, 2, 3, 4].map(
              (item) => (
                <motion.div
                  key={item}
                  animate={{
                    opacity: [
                      0.5,
                      1,
                      0.5,
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="h-64 rounded-3xl bg-white shadow-sm"
                />
              )
            )}

          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="rounded-3xl bg-white p-12 text-center shadow-sm"
          >

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E9E3FF] text-2xl text-[#7B61D9]">
              ✦
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Nothing here yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Be the first person to share
              something with the community.
            </p>

          </motion.div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">

            <AnimatePresence mode="popLayout">

              {filteredPosts.map(
                (post, index) => (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -5,
                    }}
                    className="group rounded-3xl border border-white bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60"
                  >

                    {/* ================================================= */}
                    {/* POST TOP */}
                    {/* ================================================= */}

                    <div className="flex items-start justify-between gap-4">

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          typeStyles[post.type] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {post.type}
                      </span>

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9E3FF] text-sm font-bold text-[#7055D6]">
                          {post.author
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>

                          <p className="text-xs font-bold text-slate-700">
                            {post.author}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Community member
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* ================================================= */}
                    {/* POST CONTENT */}
                    {/* ================================================= */}

                    <h3 className="mt-6 text-xl font-bold leading-7 text-slate-900">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-500">
                      {post.description}
                    </p>

                    {/* ================================================= */}
                    {/* ACTIONS */}
                    {/* ================================================= */}

                    <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">

                      <motion.button
                        type="button"
                        whileTap={{
                          scale: 0.85,
                        }}
                        animate={
                          post.liked_by_current_user
                            ? {
                                scale: [
                                  1,
                                  1.12,
                                  1,
                                ],
                              }
                            : {}
                        }
                        transition={{
                          duration: 0.25,
                        }}
                        disabled={
                          likingId ===
                          post.id
                        }
                        onClick={() =>
                          handleLikePost(
                            post.id,
                            post.liked_by_current_user
                          )
                        }
                        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                          post.liked_by_current_user
                            ? "bg-[#FDE2E4] text-[#D95D72]"
                            : "bg-[#F8F7F4] text-slate-600 hover:bg-[#FDE2E4] hover:text-[#D95D72]"
                        }`}
                      >
                        {post.liked_by_current_user
                          ? "♥ Liked"
                          : "♡ Like"}
                      </motion.button>

                      <span className="text-xs font-semibold text-slate-400">
                        {post.likes}{" "}
                        {post.likes === 1
                          ? "like"
                          : "likes"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleComments(
                            post.id
                          )
                        }
                        className="ml-auto rounded-xl bg-[#F8F7F4] px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-[#E9E3FF] hover:text-[#7055D6]"
                      >
                        {openComments ===
                        post.id
                          ? "Hide"
                          : "Comments"}
                      </button>

                    </div>

                    {/* ================================================= */}
                    {/* COMMENTS */}
                    {/* ================================================= */}

                    <AnimatePresence>

                      {openComments ===
                        post.id && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="overflow-hidden"
                        >

                          <div className="mt-5 border-t border-slate-100 pt-5">

                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Conversation
                            </p>

                            <div className="space-y-3">

                              {(comments[
                                post.id
                              ] || []).length ===
                              0 ? (
                                <p className="rounded-xl bg-[#F8F7F4] p-4 text-sm text-slate-400">
                                  No comments yet.
                                  Start the
                                  conversation.
                                </p>
                              ) : (
                                comments[
                                  post.id
                                ].map(
                                  (comment) => (
                                    <div
                                      key={
                                        comment.id
                                      }
                                      className="rounded-2xl bg-[#F8F7F4] p-3"
                                    >

                                      <p className="text-xs font-bold text-[#7055D6]">
                                        {
                                          comment.author
                                        }
                                      </p>

                                      <p className="mt-1 text-sm leading-5 text-slate-600">
                                        {
                                          comment.content
                                        }
                                      </p>

                                    </div>
                                  )
                                )
                              )}

                            </div>

                            {/* Comment input */}

                            <div className="mt-4 flex gap-2">

                              <input
                                type="text"
                                value={
                                  commentText
                                }
                                onChange={(e) =>
                                  setCommentText(
                                    e.target
                                      .value
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key ===
                                    "Enter"
                                  ) {
                                    e.preventDefault();

                                    handleCreateComment(
                                      post.id
                                    );
                                  }
                                }}
                                placeholder="Add a comment..."
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#7B61D9] focus:ring-4 focus:ring-[#E9E3FF]"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleCreateComment(
                                    post.id
                                  )
                                }
                                disabled={
                                  commenting ||
                                  !commentText.trim()
                                }
                                className="rounded-xl bg-[#7B61D9] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6B52C8] disabled:opacity-40"
                              >
                                Send
                              </button>

                            </div>

                          </div>

                        </motion.div>
                      )}

                    </AnimatePresence>

                  </motion.article>
                )
              )}

            </AnimatePresence>

          </div>
        )}

      </div>

    </main>
  );
}

export default Explore;