import { Stars } from '@react-three/drei'

export function InfiniteStars() {
    return (
        <Stars
            radius={300} // Radius of the inner sphere (default=100)
            depth={100} // Depth of area where stars should fit (default=50)
            count={3000} // Reduced from 5000 for performance
            factor={4} // Size factor (default=4)
            saturation={0} // Saturation 0-1 (default=0)
            fade={true} // Faded dots (default=false)
        />
    )
}
