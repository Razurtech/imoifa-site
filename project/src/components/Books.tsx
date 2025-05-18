import { motion } from 'framer-motion'

const books = [
  {
    id: 1,
    title: 'Sacred Wisdom of Ifá',
    author: 'Olayinka Adebayo',
    price: '$29.99',
    image: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Spirituality', 'Philosophy'],
  },
  {
    id: 2,
    title: 'Yoruba Language & Culture',
    author: 'Babatunde Ogunlade',
    price: '$24.99',
    image: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Language', 'Culture'],
  },
  {
    id: 3,
    title: 'Orisha Traditions',
    author: 'Folami Abiade',
    price: '$34.99',
    image: 'https://images.pexels.com/photos/1051073/pexels-photo-1051073.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Spirituality', 'Traditions'],
  },
  {
    id: 4,
    title: 'Modern Ifá Practice',
    author: 'Akinwande Oluwaseun',
    price: '$27.99',
    image: 'https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Practice', 'Modern'],
  },
]

export default function Books() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Yoruba Literature</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Discover our curated collection of spiritual and cultural literature.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-4"
        >
          {books.map((book) => (
            <article key={book.id} className="flex flex-col items-start">
              <div className="relative w-full">
                <img
                  src={book.image}
                  alt={book.title}
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-xl font-semibold text-white">{book.price}</p>
                </div>
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="relative z-10 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-medium text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    <a href="#">
                      <span className="absolute inset-0" />
                      {book.title}
                    </a>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">By {book.author}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  )
}