const { createContext, useState } = React;
const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const toggleFavorite = (team) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.find((fav) => fav.idTeam === team.idTeam);
            
            if (isFavorite) {
                return prevFavorites.filter((fav) => fav.idTeam !== team.idTeam);
            } else {
                return [...prevFavorites, team];
            }
        });
    };
    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};