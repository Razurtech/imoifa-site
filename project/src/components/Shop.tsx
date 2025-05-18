import { motion } from 'framer-motion'

const products = [
  {
    id: 1,
    name: 'Shango Thunder T-Shirt',
    price: '$35.99',
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Shango',
  },
  {
    id: 2,
    name: 'Yemoja Ocean T-Shirt',
    price: '$35.99',
    image: 'https://images.pexels.com/photos/3641056/pexels-photo-3641056.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Yemoja',
  },
  {
    id: 3,
    name: 'Oshun River T-Shirt',
    price: '$35.99',
    image: 'https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Oshun',
  },
]

export default function Shop() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Orisha T-Shirt Collection</h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3"
        >
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover object-center"
                />
                <div className="flex items-end p-4">
                  <div className="relative z-10 rounded-full bg-white/80 dark:bg-black/80 px-3 py-1.5 font-medium text-gray-900 dark:text-white">
                    {product.tag}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.price}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}