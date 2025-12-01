import { motion } from 'framer-motion';
import { SplineScene } from '@/components/ui/splite';

export const AnimatedRobot = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full min-h-[450px] md:min-h-[500px]"
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="w-full h-full flex items-center justify-center"
            >
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full scale-110 md:scale-125"
                />
            </motion.div>
        </motion.div>
    );
};
