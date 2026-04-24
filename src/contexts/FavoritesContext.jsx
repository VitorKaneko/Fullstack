// Extrai as funções necessárias do objeto global React (carregado via CDN)
const { createContext, useState } = React;

// Cria o Contexto
const FavoritesContext = createContext();

// Cria o Provedor (Provider) que vai englobar toda a aplicação
const FavoritesProvider = ({ children }) => {
    // Estado global que guarda os times favoritos
    const [favorites, setFavorites] = useState([]);

    // Função para adicionar ou remover um time da lista
    const toggleFavorite = (team) => {
        setFavorites((prevFavorites) => {
            // Verifica se o time já está na lista pelo seu ID único
            const isFavorite = prevFavorites.find((fav) => fav.idTeam === team.idTeam);
            
            if (isFavorite) {
                // Se já estiver favoritado, cria uma nova lista SEM esse time (remove)
                return prevFavorites.filter((fav) => fav.idTeam !== team.idTeam);
            } else {
                // Se não estiver, cria uma nova lista COM esse time (adiciona)
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