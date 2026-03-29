package lt.university.mybatis;

import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.transaction.managed.ManagedTransactionFactory;
import org.mybatis.cdi.SessionFactoryProvider;

import javax.annotation.Resource;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.sql.DataSource;
import java.io.InputStream;

@ApplicationScoped
public class MybatisProducer {

    @Resource(lookup = "java:jboss/datasources/UniversityDS")
    private DataSource dataSource;

    @Produces
    @ApplicationScoped
    @SessionFactoryProvider
    public SqlSessionFactory createSqlSessionFactory() throws Exception {
        InputStream config = getClass().getResourceAsStream("/META-INF/mybatis-config.xml");

        Environment environment = new Environment(
                "production",
                new ManagedTransactionFactory(),
                dataSource);

        org.apache.ibatis.session.Configuration configuration = new SqlSessionFactoryBuilder().build(config)
                .getConfiguration();
        configuration.setEnvironment(environment);

        return new SqlSessionFactoryBuilder().build(configuration);
    }
}
