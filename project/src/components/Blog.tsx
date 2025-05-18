import { motion } from 'framer-motion'

const posts = [
  {
    id: 1,
    title: 'Understanding the Significance of Ifá Divination',
    snippet: 'Explore the ancient practice of Ifá divination and its relevance in modern times...',
    author: 'Adebayo Ogunlesi',
    date: 'Feb 12, 2025',
    category: 'Ifá Wisdom',
    image: 'https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Sacred Rituals of the Yoruba People',
    snippet: 'Discover the meaning and importance behind traditional Yoruba ceremonies...',
    author: 'Folake Adeleke',
    date: 'Feb 10, 2025',
    category: 'Rituals',
    image: 'https://images.pexels.com/photos/1738434/pexels-photo-1738434.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Preserving Ancestral Knowledge',
    snippet: 'Learn about the importance of maintaining and passing down cultural wisdom...',
    author: 'Oluwaseun Adekunle',
    date: 'Feb 8, 2025',
    category: 'Cultural Wisdom',
    image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
]

export default function Blog() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Wisdom Blog</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Insights into Yoruba spirituality and culture.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center gap-x-4 text-xs text-white">
                    <time dateTime={post.date}>{post.date}</time>
                    <span className="relative z-10 rounded-full bg-white/20 px-3 py-1.5 font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="max-w-xl">
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">{post.snippet}</p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      <span className="absolute inset-0" />
                      {post.author}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}