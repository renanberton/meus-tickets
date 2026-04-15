FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiar arquivos do Maven
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY .mvn .mvn

# Copiar código fonte
COPY src src

# Dar permissão
RUN chmod +x mvnw

# Compilar e gerar JAR
RUN ./mvnw clean package -DskipTests

# Expor porta
EXPOSE 8080

# Rodar o JAR (usando coringa)
CMD ["sh", "-c", "java -jar target/*.jar"]