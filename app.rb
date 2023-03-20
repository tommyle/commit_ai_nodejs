class CommitAi < Formula
    desc "A CLI tool to generate git commit messages using OpenAI's GPT-4."
    homepage "https://github.com/tommyle/commit_ai_nodejs/tree/main"
    url "https://github.com/tommyle/commit_ai_nodejs/archive/refs/tags/v0.0.4.tar.gz"
    sha256 "31841eb4054168fa8ffa601b5988ea1e376e75b4374db980f4b43d8363393da2"
    license "MIT"
  
    depends_on "node"
  
    def install
      libexec.install Dir["*"]
      bin.install_symlink "#{libexec}/app.js" => "commitai"
    end
  
    test do
      system "#{bin}/commitai", "--version"
    end
  end
  