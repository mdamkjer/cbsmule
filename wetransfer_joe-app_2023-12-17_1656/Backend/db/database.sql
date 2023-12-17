CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    UserName VARCHAR(100),
    Email VARCHAR(100),
    Password VARCHAR(100),
    PhoneNumber VARCHAR(20)
    Juice VARCHAR(50),
    Coffee VARCHAR(50),
    Sandwich VARCHAR(50)
);

CREATE TABLE Favorites (
    FavoritesID INT IDENTITY(1,1) PRIMARY KEY,
    Juice VARCHAR(50),
    Coffee VARCHAR(50),
    Sandwich VARCHAR(50)
);

CREATE TABLE UserFavorites (
    UserFavoritesID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT,
    FavoritesID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (FavoritesID) REFERENCES Favorites(FavoritesID)
);