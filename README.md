# The Count Of Money

## Installation
* Clone and change directory
    ```
    git clone https://github.com/EpitechMscPro2020/T-WEB-700-41.git

    cd T-WEB-700-41
    ```

## Usage

* Export the following environment variables in order to create the root user and password for mongo:
    * **Linux/MacOS**: Add the following lines to your $HOME/.bash_profile or $HOME/.bashrc (if you are using zsh then ~/.zprofile or ~/.zshrc) config file:
        ```
        export MONGO_INITDB_ROOT_USERNAME=EnterYourRootUserHere
        export MONGO_INITDB_ROOT_PASSWORD=EnterYourRootPasswordHere
        export MONGO_INITDB_DATABASE=TheCountOfMoney
        ```

### Run application with Docker:

* For dev environment:
    ```
    docker-compose up --build
    ```

* For production environment
    ```
    docker build -t prod ./client
    docker run -p 3000:3000 prod
    ```

## Test it

* You should be able to access the following local links:
    * [Web application](http://localhost:3000 "Web App")
    * [REST Server](http://localhost:5000 "REST Server API")

## Working with Visual Studio Code

* Don't forget to install needed extensions:
    * [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    * [EditorConfig for VS code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
