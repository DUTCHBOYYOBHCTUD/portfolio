import { Text } from '@react-three/drei'

interface CardIconProps {
    type: 'project' | 'experience' | 'skills' | 'education' | 'contact'
    color: string
}

export function CardIcon({ type, color }: CardIconProps) {
    let icon = '?'
    let fontSize = 0.25

    switch (type) {
        case 'project':
            icon = '{ }'; // Restored to curly braces
            fontSize = 0.25;
            break;
        case 'experience':
            icon = 'XP';
            fontSize = 0.25;
            break;
        case 'skills':
            icon = '</>'; // Replaces EXP
            fontSize = 0.2; // Slightly smaller for 3 chars
            break;
        case 'education':
            icon = '%';
            fontSize = 0.3;
            break;
        case 'contact':
            icon = '@';
            fontSize = 0.3;
            break;
    }

    return (
        <group>
            <Text
                fontSize={fontSize}
                color={color}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.01} // Reduced outline width
                outlineColor="#000000"
                material-toneMapped={false}
            >
                {icon}
            </Text>
        </group>
    )
}
